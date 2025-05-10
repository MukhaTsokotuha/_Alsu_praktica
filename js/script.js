function _elem(sel){
    return document.querySelector(sel)
}
function _load(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url)
    //xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    xhr.send()
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
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
            callback(xhr.responseText)   
        }
    }
}
const HOST = `http://api-messenger.web-srv.local`
var TOKEN = ''

_load('html/auth.html', doAuth)//////////////////////////////////////////////////////////////////////////////////////////////

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






function doMainPage(){
    _elem('.createChat').addEventListener('click', function(){
        console.log(1)
    })
    _get(`${HOST}/chats`, function(res){
        res = JSON.parse(res)
        console.log(res)
        let arr_chats = document.querySelectorAll('.chat p')
        for (let i = 0; i < arr_chats.length; i++) {
            arr_chats[i].textContent = res[i]["chat_name"]; 
        }
    })
    // let req_data = new FormData();
    // req_data.append('email', 'yan1@mail.com')
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', `${HOST}/chats`)
    // xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);

    // xhr.send(req_data)
    // xhr.onreadystatechange = function(){
    //     if (xhr.readyState==4){
    //         console.log(xhr.responseText)
    //     }
    // }

    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', `${HOST}/chats`)
    // xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN);
    // xhr.send()
    // xhr.onreadystatechange = function(){
    //     if (xhr.readyState==4){
    //         console.log(xhr.responseText)
            
    //     }
    // }
    _elem('.block_profile h3').addEventListener('click', function(){
        _load('html/profile.html', doProfile)
    }) 


}





function doProfile(){
    _elem('.link_chats').addEventListener('click', function(){
        _load('html/main_page.html', doMainPage)
    })
}




