//показать профиль текущего пользователя
function doProfile(){
    _elem('.btn_logout').addEventListener('click', function(){
        _delete(`${HOST}/auth`)
        //localStorage.setItem('token', '')
        timedOut()
    })
    //при нажатии на картинку показать профиль
    _elem('.info_userProfile').classList.toggle('hidden')
      if (_elem('.info_userProfile').classList.contains('hidden')){
        _elem('.block_changeProfile').classList.add('hidden')
    }
    _elem('.section').classList.toggle('brightness')
    _elem('.block_createChat').classList.toggle('brightness')
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.block_profile img').setAttribute('src', `${HOST}/${res.photo_link}`)
        _text('.name_userProfile', res.name)
        _text('.fam_userProfile', res.fam)
        _text('.otch_userProfile', res.otch)
        _text('.email_userProfile', res.email)
    },'.answer_text')
    _elem('.btn_toChangeProfile').addEventListener('click', function(){
        _elem('.block_changeProfile').classList.toggle('hidden')
        changeProfile()
    })

}

//изменение профиля
function changeProfile(){
    // _elem('.section').addEventListener('click', function(){
    //     _elem('.block_changeProfile').classList.add('hidden')
    // })
    //closeWindow(['.section'], '.block_changeProfile')
    //показываем изначальные данные
    _get(`${HOST}/user`, function(res_profile){
        res_profile = JSON.parse(res_profile)
        //показать текущие данные слева
        _getById('name_changeProfile').setAttribute('value', res_profile["name"])
        _getById('fam_changeProfile').setAttribute('value',res_profile["fam"])
        _getById('otch_changeProfile').setAttribute('value',res_profile["otch"])
        _getById('email_changeProfile').setAttribute('value',res_profile["email"])
        
    },'.answer_text')
    //меняем данные
    _event('.btn_change_data', function(){
        let req_data = new FormData();
        req_data.append("photo_link", _getById('photo_changeProfile').value)
        req_data.append("name", _getById('name_changeProfile').value)
        req_data.append("email", _getById('email_changeProfile').value)
        req_data.append("fam", _getById('fam_changeProfile').value)
        req_data.append("otch", _getById('otch_changeProfile').value)
        req_data.append("pass", localStorage.getItem('oldPass'))
        
        _put(`${HOST}/user?pass=${localStorage.getItem('oldPass')}&email=${_getById('email_changeProfile').value}&fam=${_getById('fam_changeProfile').value}&name=${_getById('name_changeProfile').value}&otch=${_getById('otch_changeProfile').value}&photo_link=`, function(res){
            res = JSON.parse(res)
            if (res.message){
                alert(res["message"])
            }else{
                 _text('.message_block_profile', 'Данные успешно изменены')
            }
           
            console.log(res)
        })
    })
    //смена пароля
    _event('.btn_toChangePass', function(){
        _elem('.block_changePassword').classList.toggle('hidden')
        _elem('.userProfile').classList.toggle('brightness')
        _elem('.info_userProfile').classList.toggle('brightness')
        changePassword()
    })
}

function changePassword(){
    //  _elem('.section').addEventListener('click', function(){
    //         _elem('.block_changePassword').classList.add('hidden')
    //         _elem('.userProfile').classList.add('brightness')
    //         _elem('.info_userProfile').classList.add('brightness')
    //     })

    _event('.btn_changePass', function(){
        let old_pass = _getById('oldPass').value
        let new_pass_1 = _getById('newPass_1').value
        let new_pass_2 = _getById('newPass_2').value
        if (new_pass_1==new_pass_2 && old_pass == localStorage.getItem('oldPass')){
            let req_data = new FormData();
            req_data.append("photo_link", _getById('photo_changeProfile').value)
            req_data.append("name", _getById('name_changeProfile').value)
            req_data.append("email", _getById('email_changeProfile').value)
            req_data.append("fam", _getById('fam_changeProfile').value)
            req_data.append("otch", _getById('otch_changeProfile').value)
            localStorage.setItem('oldPass', new_pass_1)
            req_data.append("pass", localStorage.getItem('oldPass'))
            
            _put(`${HOST}/user?pass=${localStorage.getItem('oldPass')}&email=${_getById('email_changeProfile').value}&fam=${_getById('fam_changeProfile').value}&name=${_getById('name_changeProfile').value}&otch=${_getById('otch_changeProfile').value}&photo_link=`, function(res){
                res = JSON.parse(res)
                //alert(res["message"])
               
            })
             alert('Пароль успешно изменен')

        }else if(new_pass_2 != new_pass_1){
            alert('Пароли не совпадают')
        }else{
            alert('Неверный текущий пароль')
        }

    })
}

