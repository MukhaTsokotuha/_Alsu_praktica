
function _elem(sel){
    return document.querySelector(sel)
}
function _event(sel,f){
    return _elem(sel).addEventListener('click', f)
}
function _getById(sel){
    return document.getElementById(sel)
}
function timedOut(){////////////////////////////ВРЕМЯ СЕССИИ ИСТЕКЛО
    _load('views/auth.html', doAuth)
}
//#region AJAX
function _load(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 ){
            if (xhr.status == 401 ){
                flag=1
                timedOut()
            }else{
                _elem('body').innerHTML = xhr.responseText
                if (callback){
                    callback(xhr.responseText)
                }
                flag=0
            }
            
        }
    }
}
function _get(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                flag = 1
                timedOut()
            }else{
                 callback(xhr.responseText)   
                 flag = 0
            }
           
        }
    }
}
function _post(url, data, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send(data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                flag = 1
                timedOut()
            }else{
                flag = 0
                if (callback){
                    callback(xhr)   
                }
            }
            
           
        }
    }
}
function _put(url, data, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send(data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                flag = 1
                timedOut()
            }else{
                flag = 0
                if (callback){
                    callback(xhr)   
                }
            }
        }
    }
}
function _delete(url,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                flag=1
                timedOut()
            }else{
                flag = 0
                if (callback){
                    callback(xhr.responseText)   
                }
            }
          
        }
    }
}

//#endregion

const HOST = `http://api-messenger.web-srv.local`
var TOKEN = ''
var MyEmail = ''
_load(`views/auth.html`, doPageAuth)

//#region Auth/Reg
function doPageAuth(){
    ///////////////////////КНОПКИ АВТОРИЗАЦИИ И РЕГИСТРАЦИИ
    _event('.tumb_reg', function(){
        _elem('.form_auth').style.display = 'none'
        _elem('.form_auth').style.display = 'none'
        _elem('.form_reg').style.display = 'flex'
        _elem('.block_reg_btn').style.display = 'flex'
        _elem('.block_auth_btn').style.display = 'none'
        _elem('.block_auth_and_reg').style = 'background-color: rgb(60, 148, 207); '
    })
    _event('.tumb_auth', function(){
        _elem('.form_reg').style.display = 'none'
        _elem('.form_reg').style.display = 'none'
        _elem('.form_auth').style.display = 'flex'
        _elem('.block_auth_btn').style.display = 'flex'
        _elem('.block_reg_btn').style.display = 'none'
        _elem('.block_auth_and_reg').style = ' background-color: #3ACC91; '
    })

    _event('.btn_auth', function(){
        doAuth()
    })
    _event('.btn_reg', function(){
        doReg()
    })
}

function doAuth(){
    //_elem('header').classList.add('hidden')
    let req_data = new FormData();
    req_data.append('email', _elem('.email_auth').value)
   
    console.log( _elem('.email_auth').value )
    req_data.append('pass', _elem('.pass_auth').value)

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOST}/auth`)
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4){
            if (xhr.status == 200){
                TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
              
                 MyEmail=JSON.parse(xhr.responseText)["Data"]["email"]
                _load(`views/main_page.html`, doMainPage)
            }else{
                _elem('.block_auth_btn .message_error').textContent = (JSON.parse(xhr.responseText)).message
            } 
        }
    } 
}

function doReg(){
    //_elem('header').classList.add('hidden')
  
    let req_data = new FormData();
    req_data.append('name', _getById('name_reg').value)
    req_data.append('fam', _getById('fam_reg').value)
    req_data.append('otch', _getById('otch_reg').value)
    req_data.append('email', _getById('email_reg').value)
    req_data.append('pass', _getById('pass_reg').value)
    req_data.append('photo_link', '')
    let xhr = new XMLHttpRequest();
    xhr.open('POST',`${HOST}/user` )
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4){
            if (xhr.status = 422){
                // console.log((JSON.parse(xhr.responseText)).message)
                _elem('.block_auth_btn .message_error').textContent = (JSON.parse(xhr.responseText)).message
                _elem('.block_reg_btn .message_error').textContent = (JSON.parse(xhr.responseText)).message
            }else{
                TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                console.log(JSON.parse(xhr.responseText))
                _get('views/main_page.html', doMainPage)

            }
            
        }
    }
}
//#endregion





//#region CHATS

function doMainPage(){
    
        
  
    _elem('header').classList.remove('hidden')
    //получаем список чатов с обработчиками
    makeChats() 
    

    //ЗАПУСКАЕМ ТАЙМЕР
    let timer = setInterval(function(){
        //ОТПРАВЛЯЕМ  ЗАПРОС КАЖДЫЕ 300МС
        _get(`${HOST}/chats`, function(response){
            
            response = JSON.parse(response)
            response.forEach(el => {   //ПЕРЕБИРАЕМ ЧАТЫ
                let chat_id = el["chat_id"]//ЗАПИСАЛИ ОТДЕЛЬНО ID ЧАТА
               
                //ЕСЛИ ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В ЗАПРОСЕ ОТЛИЧАЕТСЯ ОТ ТОГО, ЧТО ХРАНИТСЯ В ХРОМЕ, ТО
                if (el["chat_last_message"] != localStorage.getItem(chat_id) ){
                    
                    _elem('.content_messages').textContent=''
                    //ПЕРЕЗАГРУЖАЕМ СООБЩЕНИЯ
                    showMessages(chat_id)
                }
           
                //ЕСЛИ КАКОГО ТО ЧАТА НЕТ, ТО СТРОИМ ЕГО
                if (!(document.getElementById(chat_id))){
                    let chatBlock = document.createElement('div')
                    chatBlock.className = 'chat';
                    chatBlock.setAttribute('id', chat_id)//каждому чату свой id
                    let chatBlockText = document.createElement('p')
                    chatBlockText.setAttribute('id', el["companion_email"])

                    chatBlockText.textContent = el.chat_name; //отображаем название чата
                    chatBlock.append(chatBlockText)
                
                    _elem('.list_chats').append(chatBlock)//аппендим каждый блок чата в список чатов

                }
                localStorage.setItem(chat_id, el["chat_last_message"])//ОБНОВЛЯЕМ ДАННЫЕ В ХРОМЕ
               
            })
            
        })
      
        if (flag == 1){
            timedOut()
            clearInterval(timer)
        }
    },30000)
   


    _event('.btn_create_chat', function(){
        let email_req = new FormData()
        email_req.append('email', _elem('.form_createChat input').value)
        _post(`${HOST}/chats`, email_req, function(res){
            
            if (res.status == 200){
                _elem('.answer_text').textContent = 'Чат успешно создан'
            }else{
                
                _elem('.answer_text').textContent = 'Чат с данным пользователем уже существует'
            }
            
        })
    })

    //профиль
    _event('header img', function(){
        doProfile()
    })


   

    //Удалить пользователя
    _elem('.btn_delete').addEventListener('click', function(){
        _delete(`${HOST}/user`)
       /// _elem('.block_profile').classList.toggle('hidden')
        // clearInterval(timer)
        _load('views/auth.html', doAuth)
        timedOut()

    })
}

function func_sendMes(chat_id){             
    let text = _elem('.send_message input').value
    let req_data_mes = new FormData();
    req_data_mes.append('chat_id', chat_id)
    req_data_mes.append('text', text)
    _post(`${HOST}/messages`, req_data_mes, function(res){
        _elem('.content_messages').textContent = ''
        showMessages(chat_id)
    })
   // _elem('.send_message button').removeEventListener('click', func_sendMes())
    
}
function makeChats(){
    
    //получаем список чатов и выводим в окно с чатами
    _get(`${HOST}/chats`, function(res_chats){

        res_chats = JSON.parse(res_chats)
        alert(res_chats)
        //проходимся по массиву чатов
          
        res_chats.forEach(element => {
            //создаём блоки с чатами

            // ЕСЛИ В ДОКУМЕНТЕ НЕТ ЧАТА С ТАКИМ ID, ТО СОЗДАЁМ ЕГО (В НАЧАЛЕ НЕТ НИКАКИХ ID) 

            let chat_id = element["chat_id"]
            
            //alert(chat_id)
            if (!(document.getElementById(chat_id))){
                let chatBlock = document.createElement('div')
                chatBlock.className = 'chat';

                    

                        //при нажатии на блок чата выводим сообщения в диалоговое окно
                        chatBlock.addEventListener('click', function(){
                            makeActiveChat(chatBlock, document.querySelectorAll('.chat'))
                            chat_id = chatBlock.getAttribute('id')
                            _elem('.send_message button').addEventListener('click', func_sendMes(chat_id))
                            _elem('.content_messages').textContent = ''
                        // sendMessage(chat_id)//ОТПРАВКА СООБЩЕНИЙ - ОБРАБОТКА INPUT
                                            
                            showMessages(chat_id)//ВЫВЕСТИ СООБЩЕНИЯ
                            
                           
                                
                              
                            
                        })
                    

                chatBlock.setAttribute('id', chat_id)//каждому чату свой id
                let chatBlockText = document.createElement('p')
                chatBlockText.setAttribute('id', element["companion_email"])

                
                    chatBlockText.addEventListener('click', function(){
                        _elem('.page_profile').classList.toggle('hidden')
                        _elem('section').classList.toggle('brightness')
                        _elem('header').classList.toggle('brightness')
                        showUserProfile(element["companion_email"])
                    })
                

                chatBlockText.textContent = element.chat_name; //отображаем название чата
                let change = document.createElement('div')
                change.setAttribute('class', 'change')
                    change.addEventListener('click', function(){
                        _elem('.change_chatName').classList.toggle('hidden')
                        _event('.change_chatName button', function(){
                            let new_chatName = _elem('.change_chatName input').value
                            let req_data_newName = new FormData()
                            req_data_newName.append('chat_id', chat_id)
                            req_data_newName.append('chat_name', new_chatName)
                            _post(`${HOST}/chats`,req_data_newName, function(res){
                                if (res.status == 422){
                                     _elem('.message_change_chat').textContent = (JSON.parse(res.responseText)).message
                                }
                               
                            })
                        }, {once:true})
                       
                    })
                // document.querySelectorAll('.change').forEach(element => {
                    
                // })
                let point = document.createElement('div')
                point.className = 'point'
                chatBlock.append(chatBlockText)
                chatBlock.append(change)
                chatBlock.append(point)
                
                _elem('.list_chats').append(chatBlock)//аппендим каждый блок чата в список чатов

            }
           
            //ЗАПИСЫВАЕМ В ПАМЯТЬ БРАУЗЕРА ID ЧАТА И ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В НЁМ
            localStorage.setItem(chat_id, element["chat_last_message"])
        });
       // chats()

    })
  
}

// function chats(){
// //навешиваем обаботчики на чаты

//     document.querySelectorAll('.chat p').forEach(element => {
//         element.addEventListener('click', function(){
//             _elem('.page_profile').classList.toggle('hidden')
//             _elem('section').classList.toggle('brightness')
//             _elem('header').classList.toggle('brightness')
//             showUserProfile(element.getAttribute('id'))
//             //_load('views/usersProfiles.html', showUserProfile(element.getAttribute('id')))
//         })
//     })

//     //#region Изменить название чата!!!!
//     document.querySelectorAll('.change').forEach(element => {
//         _event('.change_chatName button', function(){
//             let new_chatName = _elem('.change_chatName input').value
//         })
//     })
//     document.querySelectorAll('.chat').forEach(el => {

//         //при нажатии на блок чата выводим сообщения в диалоговое окно
//         el.addEventListener('click', function(){
//              makeActiveChat(el, document.querySelectorAll('.chat'))
//             chat_id = el.getAttribute('id')
//             _elem('.content_messages').textContent = ''
//            // sendMessage(chat_id)//ОТПРАВКА СООБЩЕНИЙ - ОБРАБОТКА INPUT
            
//             showMessages(chat_id)//ВЫВЕСТИ СООБЩЕНИЯ
//             _event('.send_message button', function(){
//                 let text = _elem('.send_message input').value
//                 let req_data_mes = new FormData();
//                 req_data_mes.append('chat_id', chat_id)
//                 req_data_mes.append('text', text)
                
//                 _post(`${HOST}/messages`, req_data_mes, function(res){
//                     console.log(11)
//                 })
//             })
//         })
//     })
    
    
// }
function makeActiveChat(el, array){
    array.forEach(elem=>{
        elem.classList.remove('chat_active')
    })
    el.classList.toggle('chat_active')
}


//ОТПРАВКА СООБЩЕНИЯ - ОБРАБОТКА INPUT
// function sendMessage(chat_id){
//    // _elem('.sendMessage').removeEventListener('click', funcSendMesage)
//     //alert(chat_id)
//     _event('.send_message button', function(){
//         let text = _elem('.send_message input').value
//         let req_data_mes = new FormData();
//         req_data_mes.append('chat_id', chat_id)
//         req_data_mes.append('text', text)
        
//         _post(`${HOST}/messages`, req_data_mes, function(res){
//             console.log(11)
//         })
//     })
// }

//ВЫВЕСТИ СООБЩЕНИЯ
function showMessages(el){
    //alert(el)
     _get(`${HOST}/messages/?chat_id=${el}`, function(res_messages){
                   
        res_messages = JSON.parse(res_messages)
   
            
        res_messages.forEach(element => {
            //если email совпадает с моим, то 
            if(element["sender"]["email"] == MyEmail){
                //создаём сообщение с классом message_1
                let message_block = document.createElement('div')
                message_block.className='my_message'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
                message_block_text.textContent = element.text

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.content_messages').append(message_block)

            //сообщения собеседника
            }else{                                              
                //создаём сообщение с классом message_2
                let message_block = document.createElement('div')
                message_block.className='companion_message'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
                message_block_text.textContent = element.text

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.content_messages').append(message_block)
            }
        })//--FOREACH
    })
}
//#endregion

function showUserProfile(email){
    _get(`${HOST}/user/?email=${email}`, function(res){
        res = JSON.parse(res)
        //_elem('.page_profile img').setAttribute('src', res["photo_link"])
        _elem('.page_profile .name').textContent = res["name"]
        _elem('.page_profile .fam').textContent = res["fam"]
        _elem('.page_profile .otch').textContent = res["otch"]
        _elem('.page_profile .email').textContent = res["email"]
        _event('.back_profile', function(){
            _elem('.page_profile').classList.toggle('hidden')
                _elem('section').classList.toggle('brightness')
                _elem('header').classList.toggle('brightness')
        })
    } )
  
   
}







//#region MENU and PROFILE



//показать профиль текущего пользователя
function doProfile(){
    _elem('.btn_logout').addEventListener('click', function(){
        flag = 1
        timedOut()
    })
    //при нажатии на картинку показать профиль
    _elem('.info_userProfile').classList.toggle('hidden')
    _elem('.section').classList.toggle('brightness')
    _elem('.block_createChat').classList.toggle('brightness')
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.name_userProfile').textContent = res.name
        _elem('.fam_userProfile').textContent = res.fam
        _elem('.otch_userProfile').textContent = res.otch
        _elem('.email_userProfile').textContent = res.email
    })
    _event('.btn_toChangeProfile', function(){
        _elem('.block_changeProfile').classList.toggle('hidden')
        changeProfile()
    })
}

//изменение профиля
function changeProfile(){
    //показываем изначальные данные
    _get(`${HOST}/user`, function(res_profile){
        res_profile = JSON.parse(res_profile)
        //показать текущие данные слева
        _getById('name_changeProfile').textContent = res_profile["name"]
        _getById('fam_changeProfile').textContent = res_profile["fam"]
        _getById('otch_changeProfile').textContent = res_profile["otch"]
        _getById('email_changeProfile').textContent = res_profile["email"]
        _getById('pass_changeProfile').textContent = res_profile["pass"]  
    })
    //меняем данные
    _event('.btn_change_data', function(){
        let req_data = new FormData();
        req_data.append("photo_link", 'file//')
        req_data.append("name", _getById('name_changeProfile').value)
         req_data.append("email", _getById('email_changeProfile').value)
        req_data.append("fam", _getById('fam_changeProfile').value)
        req_data.append("otch", _getById('otch_changeProfile').value)
        req_data.append("pass", _getById('pass_changeProfile').value)
        
        _put(`${HOST}/user`, req_data, function(res){
            if (res.status == 422){
                res = JSON.parse(res.responseText)
            
                _elem('.message_block').textContent = res.message
            }else{
                res = JSON.parse(res.responseText)
                _elem('.message_block').textContent = res.message
            }
        })
    })
 
}
//#endregion
