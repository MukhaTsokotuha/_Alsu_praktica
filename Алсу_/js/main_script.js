//#region Функции
function _elem(sel){
    return document.querySelector(sel)
}
function _event(sel, callback){
    return document.querySelector(sel).addEventListener('click', callback)
}
function _getById(sel){
    return document.getElementById(sel)
}
function timedOut(){////////////////////////////ВРЕМЯ СЕССИИ ИСТЕКЛО
    _load('html/auth.html', doAuth)
}

function _load(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                flag=1
                timedOut()
            }else{
                _elem('section').innerHTML = xhr.responseText
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


_load('html/auth.html', doAuth)

var MyEmail = 'yan@mail.com'
//#region AUTH REG
function doAuth(){
    _elem('header').classList.add('hidden')
    _event('.btn_auth', function(){
        let req_data = new FormData();
        req_data.append('email', _elem('.email_auth').value)
        
        console.log( _elem('.email').value )
        req_data.append('pass', _elem('.pass').value)

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${HOST}/auth`)
        xhr.send(req_data)
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4){
                if (xhr.status == 200){
                    TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                    console.log(JSON.parse(xhr.responseText)["Data"]["token"])
                    
                    _load(`html/main_page.html`, doMainPage)
                }else{
                    _elem('.block_error').textContent = (JSON.parse(xhr.responseText)).message
                } 
            }
        } 
        console.log(1)
    })
    _event('.btn_reg', function(){
        _load('html/registration.html', doReg)
    })
}
function doReg(){
    _elem('header').classList.add('hidden')
    _event('.btn_reg', function(){
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
                    _elem('.block_error').textContent = (JSON.parse(xhr.responseText)).message
                }else{
                    TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                    console.log(JSON.parse(xhr.responseText))
                    _get('html/main_page.html', doMainPage)
                }
                
            }
        }
        
    })
    // _event('.btn_auth', function(){
    //     _load('html/auth.html', doAuth)
    // })
  
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
               

                //#region ЧАТЫЫ!!!
                if (el["chat_last_message"] != localStorage.getItem(chat_id) ){
                    //ПЕРЕЗАГРУЖАЕМ ЧАТЫ
                    makeChats(chat_id)
                    showMessages(chat_id)
                }
                //#endregion
                //ЕСЛИ КАКОГО ТО ЧАТА НЕТ, ТО СТРОИМ ЕГО
                if (!(document.getElementById(chat_id))){
                    let chatBlock = document.createElement('div')
                    chatBlock.className = 'block_chat';
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
        if (flag = 1){
            clearInterval(timer)
        }
    },300)
}


function makeChats(){
  
    //получаем список чатов и выводим в окно с чатами
    _get(`${HOST}/chats`, function(res_chats){

        res_chats = JSON.parse(res_chats)

        //проходимся по массиву чатов
        res_chats.forEach(element => {
            //создаём блоки с чатами

            // ЕСЛИ В ДОКУМЕНТЕ НЕТ ЧАТА С ТАКИМ ID, ТО СОЗДАЁМ ЕГО (В НАЧАЛЕ НЕТ НИКАКИХ ID) 

            let chat_id = element["chat_id"]
            if (!(document.getElementById(chat_id))){
                let chatBlock = document.createElement('div')
                chatBlock.className = 'block_chat';
                chatBlock.setAttribute('id', chat_id)//каждому чату свой id
                let chatBlockText = document.createElement('p')
                chatBlockText.setAttribute('id', element["companion_email"])

                chatBlockText.textContent = element.chat_name; //отображаем название чата
                chatBlock.append(chatBlockText)
             
                _elem('.list_chats').append(chatBlock)//аппендим каждый блок чата в список чатов
            }

            //ЗАПИСЫВАЕМ В ПАМЯТЬ БРАУЗЕРА ID ЧАТА И ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В НЁМ
            localStorage.setItem(chat_id, element["chat_last_message"])

    
        });


        //навешиваем обаботчики на чаты
        document.querySelectorAll('.block_chat').forEach(el => {

            //при нажатии на блок чата выводим сообщения в диалоговое окно
            el.addEventListener('click', function(){
                makeActiveChat(el, document.querySelectorAll('.block_chat'))

                //очищаем окно с сообщениями
                _elem('.block_messages').textContent = '';
                sendMessage(el.getAttribute('id'))//ОТПРАВКА СООБЩЕНИЙ - ОБРАБОТКА INPUT

                showMessages(el.getAttribute('id'))//ВЫВЕСТИ СООБЩЕНИЯ
               
            })
        })

        document.querySelectorAll('.block_chat p').forEach(element => {
            element.addEventListener('click', function(){
                _load('html/usersProfiles.html', showUserProfile(element.getAttribute('id')))
            })
        })
    })
}
function makeActiveChat(el, array){
    array.forEach(elem=>{
        elem.classList.remove('block_chat_active')
    })
    el.classList.toggle('block_chat_active')
}

function showUserProfile(email){
    _get(`${HOST}/user/?email=${email}`, function(res){
        res = JSON.parse(res)
        _elem('.page_profile img').setAttribute('src',res["photo_link"])
        _elem('.page_profile .name').textContent = res["name"]
        _elem('.page_profile .fam').textContent = res["fam"]
        _elem('.page_profile .otch').textContent = res["otch"]
        _elem('.page_profile .email').textContent = res["email"]
         _event('.link_chats', function(){
            _load('html/main_page.html', doMainPage)
        })
    } )
   
}
//ОТПРАВКА СООБЩЕНИЯ - ОБРАБОТКА INPUT
function sendMessage(chat_id){
    _event('.input_messages button', function(){
        let text = _elem('.input_messages input').value
        let req_data_mes = new FormData();
        req_data_mes.append('chat_id', chat_id)
        req_data_mes.append('text', text)
        
        _post(`${HOST}/messages`, req_data_mes, function(res){
            console.log(11)
        })
    })
}

//ВЫВЕСТИ СООБЩЕНИЯ
function showMessages(el){
     _get(`${HOST}/messages/?chat_id=${el}`, function(res_messages){
                   
        res_messages = JSON.parse(res_messages)
            
        res_messages.forEach(element => {
            //если email совпадает с моим, то 
            if(element["sender"]["email"] == MyEmail){
                //создаём сообщение с классом message_1
                let message_block = document.createElement('div')
                message_block.className='message_1'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
                message_block_text.textContent = element.text

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.block_messages').append(message_block)

            //сообщения собеседника
            }else{                                              
                //создаём сообщение с классом message_2
                let message_block = document.createElement('div')
                message_block.className='message_2'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
                message_block_text.textContent = element.text

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.block_messages').append(message_block)
            }
        })//--FOREACH
    })
}
//#endregion









//#region MENU and PROFILE

_event('.btn_create_chat', function(){
    let email_req = new FormData()
    email_req.append('email', _elem('.input_create_chat input').value)
    _post(`${HOST}/chats`, email_req, function(res){
        
        if (res.status == 200){
            _elem('.block_message').textContent = 'Чат успешно создан'
        }else{
            
            _elem('.block_message').textContent = 'Чат с данным пользователем уже существует'
        }
        
    })
})

//профиль
_event('.block_header img', function(){
    doProfile()
})

//сброс токена и выход
_elem('.btn_logout').addEventListener('click', function(){
    _delete(`${HOST}/auth`)
    _elem('.block_profile').classList.toggle('hidden')
    _load('html/auth.html', doAuth)

})

//показать профиль текущего пользователя
function doProfile(){
    //при нажатии на картинку показать профиль
    _elem('.block_profile').classList.toggle('hidden')
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.text_profile .name').textContent = res.name
        _elem('.text_profile .fam').textContent = res.fam
        _elem('.text_profile .otch').textContent = res.otch
        _elem('.text_profile .email').textContent = res.email
    })
    // _event('.block_header', function(){
    //     _elem('.block_profile').classList.toggle('hidden');
    //     _get(`${HOST}/user`, function(res){
    //         res = JSON.parse(res)
    //         _getById('name').textContent = res["name"]
    //         _getById('fam').textContent = res["fam"]
    //         _getById('otch').textContent = res["otch"]
    //         _getById('email').textContent = res["email"]
    //     })
    // })
    //на страницу изменения профиля
    _event('.btn_toPage_changeProfile', function(){
         
        _elem('.block_profile').classList.toggle('hidden')
        _load('html/changeProfile.html', changeProfile)
    })
}

//изменение профиля
function changeProfile(){
    _elem('header').classList.add('hidden')
    //показываем изначальные данные
    _get(`${HOST}/user`, function(res_profile){
        res_profile = JSON.parse(res_profile)
        //показать текущие данные слева
        _elem('.abs_info .email').textContent = res_profile["email"]
        _elem('.abs_info .name').textContent = res_profile["name"]
        _elem('.abs_info .fam').textContent = res_profile["fam"]
        _elem('.abs_info .otch').textContent = res_profile["otch"]
         _elem('.abs_info .email').textContent = res_profile["email"]
        _elem('.abs_info .pass').textContent = res_profile["pass"]  
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
    _event('.link_chats', function(){
        _load('html/main_page.html', doMainPage)
    })
}
//#endregion






