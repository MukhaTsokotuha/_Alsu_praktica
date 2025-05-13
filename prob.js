//#region Функции
function _elem(sel){
    return document.querySelector(sel)
}
function timedOut(){////////////////////////////ВРЕМЯ СЕССИИ ИСТЕКЛО
    _load('html/auth.html', doAuth)
}
function _load(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    //xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                timedOut()
            }
            _elem('section').innerHTML = xhr.responseText
            if (callback){
                callback(xhr.responseText)
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
                timedOut()
            }
            callback(xhr.responseText)   
        }
    }
}
function _post(url, data, callback){
    let req_data = new FormData();
    req_data.append('email',data)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                timedOut()
            }
            if (callback){
                callback(xhr)   
            }
           
        }
    }
}
function _delete(url){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 401){
                timedOut()
            }
            if (callback){
                callback(xhr)   
            }
        }
    }
}

//#endregion
const HOST = `http://api-messenger.web-srv.local`
var TOKEN = ''

_load('html/main_page.html', doMainPage)/////////////////НАЧАЛЬНАЯ СТРАНИЦА/////////////////////////////////////////////////////////////////////////////

_elem('.btn_logout').addEventListener('click', function(){
    _load('html/auth.html', doAuth)
})

function doReg(){
    _elem('.btn_log').addEventListener('click', function(){
        let req_data = new FormData();
        req_data.append('name', _elem('.name').value)
        req_data.append('fam', _elem('.fam').value)
        req_data.append('otch', _elem('.otch').value)
        req_data.append('email', _elem('.email').value)
        req_data.append('pass', _elem('.pass').value)
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
    _elem('.btn_auth').addEventListener('click', function(){
        _load('html/auth.html', doAuth)
    })
  
}
function doAuth(){
    _elem('.btn_log').addEventListener('click', function(){
        let req_data = new FormData();
        req_data.append('email', _elem('.email').value)
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
    })
    _elem('.btn_reg').addEventListener('click', function(){
        _load('html/reg.html', doReg)
    })
}

_elem('.btn_logout').addEventListener('click', function(){
    _delete(`${HOST}/auth`)
})


function doMainPage(){
//СОЗДАЁМ ЧАТ
    _elem('.createChat').addEventListener('click', function(){
        _post(`${HOST}/chats`, _elem('.header_chats input').value, function(res){
            if (res.status == 422){
                res = JSON.parse(res.responseText)
                _elem('.block_message').textContent = res["message"]
            }else{
                _elem('.block_message').textContent = 'Чат успешно создан'
            }
        })
       
    })

/////////ПЕРВАЯ ЗАГРУЗКА ЧАТОВ - ПОЛУЧАЕМ ПЕРВЫЙ LAST RESPONSE ДЛЯ ПОСЛЕДУЮЩИХ ПРОВЕРОК
    _get(`${HOST}/chats`, function(res){
        res = JSON.parse(res)
        res_last = new Object();
        for (let index = 0; index < res.length; index++) {
////ЗАПИСЫВАЕМ ID И CHAT_LAST_MESSAGE В ОБЪЕКТ RES_LAST
            res_last[`${res[index]["chat_id"]}`] = res[index]["chat_last_message"];
            
///////////////СОЗДАЁМ СПИСКИ ЧАТОВ
            let chatBlock = document.createElement('div')
            chatBlock.className = 'chat';
            let chatBlockText = document.createElement('p')
            chatBlock.append(chatBlockText)

            chatBlockText.textContent = res[index]["chat_name"]; 
            document.querySelector('.block_chats').append(chatBlock)
            

            chatBlockText.addEventListener('click', function(){
                console.log(1)
                _load('html/usersProfiles.html',function(){
                    _get(`${HOST}/user/?email=${res[index]["companion_email"]}`,function(res){
                        //console.log(res, '1')
                        res = JSON.parse(res)
                        
                        _elem('.name').textContent = res["name"]
                        _elem('.fam').textContent = res["fam"]
                        _elem('.otch').textContent = res["otch"]
                        _elem('.email').textContent = res["email"]

                    })
                    _elem('.link_chats_1').addEventListener('click', function(){
                        _load(`html/main_page.html`, doMainPage)
                    })
                })
            })
            //////////////ОБРАБОТЧИК ДЛЯ ПЕРЕХОДА К ЧАТУ
            // chatBlock.addEventListener('click', function(){
            //     _elem('.content_messages').textContent='1'
            //     console.log(1)
            // })


        }
       
    })
/////ЗАПУСКАЕМ ПРОВЕРКУ ДАННЫХ
    let timer = setInterval(()=>
        _get(`${HOST}/chats`, function(res){
            // ОЧИЩАЕМ БЛОК С ЧАТАМИ, ЧТОБЫ ЗАГРУЗИТЬ НОВЫЙ
            document.querySelector('.block_chats').innerHTML = ''; 
            res = JSON.parse(res)

            for (let i = 0; i < res.length; i++) {
///////////////// ЕСЛИ В КАКОМ-ЛИБО ЧАТЕ ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ НЕ СОВПАДАЕТ С ТЕКУЩИМ И/ИЛИ 
/////////////////ПОЯВИЛИСЬ НОВЫЕ ЧАТЫ, ТО ОБНОВЛЯЕМ ЧАТЫ
                if (  ( res[i]["chat_last_message"] != res_last[ (res[i]["chat_id"]) ] )   ||   (res.length!=res_last.length) ){
                    //СОЗДАЁМ САМИ БЛОКИ С ЧАТАМИ
                    let chatBlock = document.createElement('div')
                    chatBlock.className = 'chat';
                    let chatBlockText = document.createElement('p')
                    chatBlock.append(chatBlockText)
                    chatBlockText.textContent = res[i]["chat_name"]; //ОТОБРАЖАЕМ НАЗВАНИЕ ЧАТОВ
                    document.querySelector('.block_chats').append(chatBlock)

                    //ПРИ НАЖАТИИ НА НАЗВАНИЕ ЧАТА ПЕРЕХДИМ НА СТРАНИЦУ ПОЛЬЗОВАТЕЛЯ. С КОТОРЫМ ВЕДЁМ ЧАТ
                    chatBlockText.addEventListener('click', function(){
                        _load('html/usersProfiles.html',function(){
                            _get(`${HOST}/user/?email=${res[i]["companion_email"]}`,function(res){
                                console.log(res, '1')
                                res = JSON.parse(res)
                                _elem('.name').textContent = res["name"]
                                _elem('.fam').textContent = res["fam"]
                                _elem('.otch').textContent = res["otch"]
                                _elem('.email').textContent = res["email"]

                            })
                            _elem('.link_chats_1').addEventListener('click', function(){
                                _load(`html/main_page.html`, doMainPage)//НАЗАД
                            })
                        })
                    })
                   
                } 
            }
//////////////ПЕРЕЗАПИСЫВАЕМ LAST RESPONSE
            res_last = new Object();
            for (let index = 0; index < res.length; index++) {
                res_last[`${res[index]["chat_id"]}`] = res[index]["chat_last_message"];
            }
            // console.log(res_last, 'LAST RESPONSE')
            // console.log(res, 'THIS RESPONSE')
        })
    , 100)

    //ПРИ НАЖАТИИ НА БЛОК В ЛЕВОМ ВЕРХНЕМ УГЛУ ПЕРЕХОДИМ НА СВОЮ СТРАНИЦУ
    _elem('.block_profile h3').addEventListener('click', function(){
        _load('html/profile.html', doProfile)
    }) 

}

function doProfile(){
    _elem('.link_chats').addEventListener('click', function(){
        _load('html/main_page.html', doMainPage)
    })
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.name').textContent = res["name"]
        _elem('.fam').textContent = res["fam"]
        _elem('.otch').textContent = res["otch"]
        _elem('.email').textContent = res["email"]
    })

}


_get(`${HOST}/chats`, function(res){
        res = JSON.parse(res)
        res_last = new Object();
        for (let index = 0; index < res.length; index++) {
            
///////////////СОЗДАЁМ СПИСКИ ЧАТОВ
            let chatBlock = document.createElement('div')
            chatBlock.className = 'chat';
            let chatBlockText = document.createElement('p')
            chatBlock.append(chatBlockText)

            chatBlockText.textContent = res[index]["chat_name"]; 
            document.querySelector('.block_chats').append(chatBlock)
//////////////ОБРАБОТЧИК ДЛЯ ПЕРЕХОДА К ЧАТУ
            chatBlock.addEventListener('click', function(){
                _elem('.content_messages').textContent='1'
                console.log(1)
            })
        }
        let arr_chats = document.querySelectorAll('.chat p')
        for (let i = 0; i < arr_chats.length; i++) {

            arr_chats[i].addEventListener('click', function(){
                console.log(1)
                _load('html/usersProfiles.html',function(){
                    _get(`${HOST}/user/?email=${res[i]["companion_email"]}`,function(res){
                        //console.log(res, '1')
                        res = JSON.parse(res)
                        
                        _elem('.name').textContent = res["name"]
                        _elem('.fam').textContent = res["fam"]
                        _elem('.otch').textContent = res["otch"]
                        _elem('.email').textContent = res["email"]

                    })
                    _elem('.link_chats_1').addEventListener('click', function(){
                        _load(`html/main_page.html`, doMainPage)
                    })
                })
            })
            
        }
       
    })

























































































































    ////////////////////////////////
    function doMainPage(){
//СОЗДАЁМ ЧАТ
    _elem('.createChat').addEventListener('click', function(){
        _post(`${HOST}/chats`, _elem('.header_chats input').value, function(res){
            if (res.status == 422){
                res = JSON.parse(res.responseText)
                _elem('.block_message').textContent = res["message"]
            }else{
                _elem('.block_message').textContent = 'Чат успешно создан'
            }
        })
       
    })

/////////ПЕРВАЯ ЗАГРУЗКА ЧАТОВ - ПОЛУЧАЕМ ПЕРВЫЙ LAST RESPONSE ДЛЯ ПОСЛЕДУЮЩИХ ПРОВЕРОК
    _get(`${HOST}/chats`, function(res){
        res = JSON.parse(res)
        res_last = new Object();
        for (let index = 0; index < res.length; index++) {
////ЗАПИСЫВАЕМ ID И CHAT_LAST_MESSAGE В ОБЪЕКТ RES_LAST 
            res_last[`${res[index]["chat_id"]}`] = res[index]["chat_last_message"];
           
//             if ((document.getElementById( res[index].chat_id))){
//                 let chatBlock = document.createElement('div')
//                 chatBlock.className = 'chat';
//                 let chatBlockText = document.createElement('p')
//                 chatBlock.append(chatBlockText)

//                 chatBlockText.textContent = res[index]["chat_name"]; 
//                 document.querySelector('.block_chats').append(chatBlock)

//             }

// /////////////СОЗДАЁМ СПИСКИ ЧАТОВ}

         
// ////////////ОБРАБОТЧИК ДЛЯ ПЕРЕХОДА К ЧАТУ
//             chatBlock.addEventListener('click', function(){
//                 _elem('.content_messages').textContent='1'
//                 console.log(1)
//             })
        }
//         let arr_messages = document.querySelectorAll('.chat')
        
//         for (let index = 0; index < arr_messages.length; index++) {
//             arr_messages[index].addEventListener('click', function(){
//                 _elem('.content_messages').textContent = '';
                
//                 let chat_id = res[index]["chat_id"]
//                 _elem('.sendMessage').addEventListener('click', function(){
//                     _postMessages(`${HOST}/messages`,chat_id, document.querySelector('.input_message input').value)
//                     console.log(document.querySelector('.input_message input').value)
//                 })
              
//                //ПОЛУЧИТЬ СООБЩЕНИЯ ПО ID ЧАТА
//                 _get(`${HOST}/messages/?chat_id=${chat_id}`, function(response){
//                     response = JSON.parse(response)
//                     //ПОЛУЧИТЬ EMAIL ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
//                     _get(`${HOST}/user`, function(res){
//                         res = JSON.parse(res)
//                         userEmail = res["email"]
//                         console.log(userEmail, 'GET ЗАПРОС К USER')

//                         for (let ind = 0; ind < response.length; ind++) {
// ////////////////////////СООБЩЕНИЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
//                             if(response[ind]["sender"]["email"] == userEmail){
//                                 let message_block = document.createElement('div')
//                                 message_block.className='message message1'
//                                 message_block.textContent = response[ind]["text"]
//                                 _elem('.content_messages').append(message_block)
//                                 console.log('ТЕКСТ МОЕГО СООБЩЕНИЯ', response[ind]["text"])
// ////////////////////////СООБЩЕНИЯ СОБЕСЕДНИКА
//                             }else{                                              
//                                 let message_block = document.createElement('div')
//                                 message_block.className='message message2'
//                                 message_block.textContent = response[ind]["text"]
//                                 _elem('.content_messages').append(message_block)
//                                 console.log(response[ind]["text"], "ТЕКСТ СООБЩЕНИЯ СОБЕСЕДНИКА")
//                             }
//                         }
//                     })
//                 })
//             })
            
//         }
        //ВЫВОДИМ НАЗВАНИЯ ЧАТОВ
        let arr_chats = document.querySelectorAll('.chat p')
        for (let i = 0; i < arr_chats.length; i++) {

            arr_chats[i].addEventListener('click', function(){
                console.log(1)
                _load('html/usersProfiles.html',function(){
                    _get(`${HOST}/user/?email=${res[i]["companion_email"]}`,function(res){
                        console.log(res, '1')
                        res = JSON.parse(res)
                        
                        _elem('.name').textContent = res["name"]
                        _elem('.fam').textContent = res["fam"]
                        _elem('.otch').textContent = res["otch"]
                        _elem('.email').textContent = res["email"]

                    })
                    _elem('.link_chats_1').addEventListener('click', function(){
                        _load(`html/main_page.html`, doMainPage)
                    })
                })
            })
            
        }
       
    })
 
///......//ЗАПУСКАЕМ ПРОВЕРКУ ДАННЫХ
    let timer = setInterval(function(){
            // console.log(res_last)

            
            _get(`${HOST}/chats`, function(res){
                //document.querySelector('.block_chats').innerHTML = ''
                res = JSON.parse(res)
                console.log(res)
                for (let index = 0; index < res.length; index++) {

                    if (!(document.getElementById( res[index].chat_id))){
                       
                  
                        let chatBlock = document.createElement('div')
                        chatBlock.className = 'chat';
                        chatBlock.id = res[index].chat_id;
                        let chatBlockText = document.createElement('p')
                        chatBlock.append(chatBlockText)
                        chatBlockText.textContent = res[index]["chat_name"]; 
                        document.querySelector('.block_chats').append(chatBlock)


                                  //ОБРАБОТЧИК НАЖАТИЯ НА БЛОК СООБЩЕНИЯ
                        let arr_chats = document.querySelectorAll('.chat p')
                        for (let i = 0; i < arr_chats.length; i++) {

                            arr_chats[i].addEventListener('click', function(){
                                console.log(1)
                                _load('html/usersProfiles.html',function(){
                                    _get(`${HOST}/user/?email=${res[i]["companion_email"]}`,function(res){
                                        //console.log(res, '1')
                                        res = JSON.parse(res)
                                        
                                        _elem('.name').textContent = res["name"]
                                        _elem('.fam').textContent = res["fam"]
                                        _elem('.otch').textContent = res["otch"]
                                        _elem('.email').textContent = res["email"]

                                    })
                                    _elem('.link_chats_1').addEventListener('click', function(){
                                        _load(`html/main_page.html`, doMainPage)
                                    })
                                })
                            })   
                        }
                    }
                

                    if (!(document.getElementById( res[index].chat_id))){
                        let arr_messages = document.querySelectorAll('.chat')
                        
                        for (let i = 0; i < arr_messages.length; i++) {
                            arr_messages[i].addEventListener('click', function(){
                                _elem('.content_messages').textContent = '';
                                
                                let chat_id = res[i]["chat_id"]
                                _elem('.sendMessage').addEventListener('click', function(){
                                    _postMessages(`${HOST}/messages`,chat_id, document.querySelector('.input_message input').value)
                                    console.log(document.querySelector('.input_message input').value)
                                })
                            
                            //ПОЛУЧИТЬ СООБЩЕНИЯ ПО ID ЧАТА
                                _get(`${HOST}/messages/?chat_id=${chat_id}`, function(response){
                                    response = JSON.parse(response)
                                    //ПОЛУЧИТЬ EMAIL ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
                                    _get(`${HOST}/user`, function(res){
                                        res = JSON.parse(res)
                                        userEmail = res["email"]
                                        console.log(userEmail, 'GET ЗАПРОС К USER')

                                        for (let ind = 0; ind < response.length; ind++) {
                ////////////////////////СООБЩЕНИЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
                                            if(response[ind]["sender"]["email"] == userEmail){
                                                let message_block = document.createElement('div')
                                                message_block.className='message message1'
                                                message_block.textContent = response[ind]["text"]
                                                _elem('.content_messages').append(message_block)
                                                console.log('ТЕКСТ МОЕГО СООБЩЕНИЯ', response[ind]["text"])
                ////////////////////////СООБЩЕНИЯ СОБЕСЕДНИКА
                                            }else{                                              
                                                let message_block = document.createElement('div')
                                                message_block.className='message message2'
                                                message_block.textContent = response[ind]["text"]
                                                _elem('.content_messages').append(message_block)
                                                console.log(response[ind]["text"], "ТЕКСТ СООБЩЕНИЯ СОБЕСЕДНИКА")
                                                console.log(response)
                                            }
                                        }
                                    })
                                })
                            })
                            
                        }
                    }
                    
               
                }
            ///////////////СОЗДАЁМ СПИСКИ ЧАТОВ
                    
                //////////////ПЕРЕЗАПИСЫВАЕМ LAST RESPONSE
                res_last = new Object();
                for (let index = 0; index < res.length; index++) {
                    res_last[`${res[index]["chat_id"]}`] = res[index]["chat_last_message"];
                }
                    // if (res_last[res[index]["chat_id"]] != res[index]["chat_last_message"]){
                    //    document.getElementById( res[index].chat_id).setAttribute('style', 'background-color: #fff')
                    // }
        
                    
                // console.log(res_last, 'LAST RESPONSE')
                // console.log(res, 'THIS RESPONSE')
           
          
        // document.querySelector('.block_chats').innerHTML = ''
        }, 100)

    //ПРИ НАЖАТИИ НА БЛОК В ЛЕВОМ ВЕРХНЕМ УГЛУ ПЕРЕХОДИМ НА СВОЮ СТРАНИЦУ
    _elem('.block_profile h3').addEventListener('click', function(){
        _load('html/profile.html', doProfile)
    }) 
    })
}

function doProfile(){
    _elem('.link_chats').addEventListener('click', function(){
        _load('html/main_page.html', doMainPage)
    })
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.name').textContent = res["name"]
        _elem('.fam').textContent = res["fam"]
        _elem('.otch').textContent = res["otch"]
        _elem('.email').textContent = res["email"]
    })

}