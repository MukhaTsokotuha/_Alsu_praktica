//#region Combains
function timedOut(){
    flag = 1//очистка таймера
    localStorage.setItem('token','')
    localStorage.setItem('myEmail','')
    localStorage.setItem('oldPass', '')
    _load('views/1_auth_and_reg.html', doLoginPage)
}
function _elem(sel){
    return document.querySelector(sel)
}
function _event(sel,f){
    return _elem(sel).addEventListener('click', f)
}
function _getById(sel){
    return document.getElementById(sel)
}
function _text(sel, text){
    return _elem(sel).textContent = text
}
function _arrayElem(sel){
    return document.querySelectorAll(sel)
}
//#endregion

//#region AJAX
//если Forbidden, то вызываем функцию timeOut(), 
// которая должна перенаправлять на страницу авторизации и запускат всё по новой


function _errors(xhr, div_block){//общая функция обработки ошибок в запросах
    if (xhr.status==403 || xhr.status==422){
       // alert( (JSON.parse(xhr.responseText)).message)
        _elem(div_block).textContent =  (JSON.parse(xhr.responseText)).message
    }else if (xhr.status == 404){
        _load('views/auth_and_reg.html', doLoginPage)
    }else{
        timedOut()
    }
}
function _load(url, callback,div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  localStorage.getItem('token'));
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 ){
            if (xhr.status == 200 ){
                _elem('body').innerHTML = xhr.responseText
                callback(xhr.responseText) 
            }else{
               _errors(xhr, div_block)
            }
            
        }
    }
}
function _get(url, callback, div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  localStorage.getItem('token'))
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                if (callback){
                    callback(xhr.responseText)   
                }
            }else{
                
                _errors(xhr, div_block)
            }
        }
    }
}
function _post(url,req_data, callback,div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  localStorage.getItem('token'))
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                if (callback){
                    callback(xhr.responseText)   
                }
            }else{
                _errors(xhr, div_block)
                 
            }
        }
    }
}
function _put(url, callback,div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  localStorage.getItem('token'))
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                if (callback){
                    callback(xhr.responseText)   
                }
            }else{
                _errors(xhr, div_block)
                 
            }
        }
    }
}
function _delete(url, callback,div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  localStorage.getItem('token'))
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                localStorage.setItem('token', '')
                if (callback){
                    callback(xhr.responseText)   
                }
            }else{
                _errors(xhr, div_block)
            }
        }
    }
}


//#region

const HOST = `http://api-messenger.web-srv.local`
var TOKEN = ''
var MyEmail = ''
var flag = 0;



