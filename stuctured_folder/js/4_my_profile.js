//показать профиль текущего пользователя
function doProfile(){
    _elem('.btn_logout').addEventListener('click', function(){
        _delete(`${HOST}/auth`)
        //localStorage.setItem('token', '')
        timedOut()
    })
    //при нажатии на картинку показать профиль
    _elem('.info_userProfile').classList.toggle('hidden')
    _elem('.section').classList.toggle('brightness')
    _elem('.block_createChat').classList.toggle('brightness')
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.block_profile img').setAttribute('src', `${HOST}/${res.photo_link}`)
        _text('.name_userProfile', res.name)
        _text('.fam_userProfile', res.fam)
        _text('.otch_userProfile', res.otch)
        _text('.email_userProfile', res.email)
    },'.text_answer')
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
    },'.text_answer')
    //меняем данные
    _event('.btn_change_data', function(){
        let req_data = new FormData();
        req_data.append("photo_link", 'file//')
        req_data.append("name", _getById('name_changeProfile').value)
         req_data.append("email", _getById('email_changeProfile').value)
        req_data.append("fam", _getById('fam_changeProfile').value)
        req_data.append("otch", _getById('otch_changeProfile').value)
        req_data.append("pass", _getById('pass_changeProfile').value)
        
        _put(`${HOST}/user?pass=${_getById('pass_changeProfile').value}&email=${_getById('email_changeProfile').value}&fam=${_getById('fam_changeProfile').value}&name=${_getById('name_changeProfile').value}&otch=${_getById('otch_changeProfile').value}&photo_link=`, function(res){
            res = JSON.parse(res)
            alert(res["message"])
            _text('.message_block_profile', res.message)
        })
    })
}
