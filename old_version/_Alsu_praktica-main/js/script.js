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
            // if (xhr.status == 401){
            //     timedOut()
            // }
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
function _postMessages(url, chat_id, text, callback){
    let req_data = new FormData();
    req_data.append('chat_id',chat_id)
    req_data.append('text',text)
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
function _delete(url,callback){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
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

_load('html/auth.html', doAuth)/////////////////НАЧАЛЬНАЯ СТРАНИЦА/////////////////////////////////////////////////////////////////////////////

// _elem('.btn_logout').addEventListener('click', function(){
//     _load('html/auth.html', doAuth)
// })

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
        console.log(1)
    })
    _elem('.btn_reg').addEventListener('click', function(){
        _load('html/reg.html', doReg)
    })
}

_elem('.btn_logout').addEventListener('click', function(){
    _delete(`${HOST}/auth`)
})


function doMainPage(){
    _get(`${HOST}/chats`, function(res_chats){//показать чаты пользователя
        res_chats = JSON.parse( res_chats)
        console.log(res_chats)
        console.log(1)
    })






    _elem('.createChat').addEventListener('click', function(){
        _post(`${HOST}/chats`, _elem('.header_chats input').value, function(res){
            if (res.status == 422){
                res = JSON.parse(res.responseText)
                _elem('.block_message').textContent = res["message"]
            }else{
                _elem('.block_message').textContent = 'Чат успешно создан'
            }
        })
       
    })//создание диалога

}//function doMainPage
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