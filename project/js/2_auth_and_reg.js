

_load('views/auth_and_reg.html', doLoginPage)

var tumb = 0;
function doLoginPage(){
 
    if (localStorage.getItem('token')){
        
        _load('views/main_page.html', doMainPage)
        
    }else{

       
         _event('.tumb_reg', function(){
            tumb = 1;
            _elem('.form_auth').style.display = 'none'
            _elem('.form_auth').style.display = 'none'
            _elem('.form_reg').style.display = 'flex'
            _elem('.block_reg_btn').style.display = 'flex'
            _elem('.block_auth_btn').style.display = 'none'
            _elem('.block_auth_and_reg').style = 'background-color: rgb(60, 148, 207); '
        })
        _event('.tumb_auth', function(){
            tumb = 0;
            _elem('.form_reg').style.display = 'none'
            _elem('.form_reg').style.display = 'none'
            _elem('.form_auth').style.display = 'flex'
            _elem('.block_auth_btn').style.display = 'flex'
            _elem('.block_reg_btn').style.display = 'none'
            _elem('.block_auth_and_reg').style = ' background-color:#43B597; '
        })

        document.addEventListener('keydown', function(e){
            if (tumb == 0 && (e.code == 'Enter')){
                doAuth()
            }else if (tumb==1 && e.code == 'Enter'){
                doReg()
            }
        },{once:true})
        _event('.btn_auth', function(){
            doAuth()
        })
        _event('.btn_reg', function(){
            doReg()
        })
    }
    ///////////////////////КНОПКИ АВТОРИЗАЦИИ И РЕГИСТРАЦИИ
   
}

function doAuth(){
    //_elem('header').classList.add('hidden')
    let req_data = new FormData();
    req_data.append('email', _elem('.email_auth').value)
    req_data.append('pass', _elem('.pass_auth').value)

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOST}/auth`)
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4){
            if (xhr.status == 200){
                TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                localStorage.setItem('token', TOKEN)
                MyEmail=JSON.parse(xhr.responseText)["Data"]["email"]
                localStorage.setItem('myEmail', MyEmail)
                oldPass = JSON.parse(xhr.responseText)["Data"]["pass"]
               // alert(oldPass)
                localStorage.setItem('oldPass',oldPass )
               // alert(1)
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
                _elem('.block_reg_btn .message_error').textContent = (JSON.parse(xhr.responseText)).message
                if ((JSON.parse(xhr.responseText)).message == "Регистрация успешна") {
                    TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                    MyEmail=JSON.parse(xhr.responseText)["Data"]["email"]
                // alert(JSON.parse(xhr.responseText)["Data"]["token"])
                    localStorage.setItem('token', TOKEN)
                    _load('views/main_page.html', doMainPage)
                }
                
                // console.log((JSON.parse(xhr.responseText)).message)
            }else {
               //_elem('.block_auth_btn .message_error').textContent = (JSON.parse(xhr.responseText)).message
                TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                MyEmail = JSON.parse(xhr.responseText)["Data"]["email"]
                oldPass = JSON.parse(xhr.responseText)["Data"]["pass"]


                localStorage.setItem('myEmail', MyEmail)
                localStorage.setItem('oldPass',oldPass )
                localStorage.setItem('token', TOKEN)
                _load('views/main_page.html', doMainPage)
                
            }
        }
    }
}