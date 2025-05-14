
//создание нового чата
_elem('.btn_create_chat', function(){
    let req_data = new FormData();
    req_data.append('email', _elem('.input_create_chat input').value)
    _post(`${HOST}/chats`, req_data, function(res){
        if (res.status == 422){
            res = JSON.parse(res.responseText)
            _elem('.block_message').textContent = res["message"]
        }else{
            _elem('.block_message').textContent = 'Чат успешно создан'
        }
    })
   
})

//сброс токена и выход
_elem('.btn_logout').addEventListener('click', function(){
    _delete(`${HOST}/auth`)
    //_load('html/auth.html', doAuth)
})

//показать профиль текущего пользователя
function doProfile(){
    //при нажатии на картинку показать профиль
    _event('.block_header', function(){
        _elem('.block_profile').classList.toggle('hidden');
        _get(`${HOST}/user`, function(res){
            res = JSON.parse(res)
            _getById('name').textContent = res["name"]
            _getById('fam').textContent = res["fam"]
            _getById('otch').textContent = res["otch"]
            _getById('email').textContent = res["email"]
        })
    })
    //на страницу изменения профиля
    _event('.btn_toPage_changeProfile', function(){
        _load('html/changeProfile.html', changeProfile)
    })

  
}

//изменение профиля
function changeProfile(){
    //показываем изначальные данные
    _get(`${HOST}/user`, function(res_profile){
        res_profile = JSON.parse(res_profile)
        //показать старые данные в input
        _getById('email_changeProfile').textContent = res_profile["email"]
        _getById('name_changeProfile').value = res_profile["name"]
        _getById('fam_changeProfile').value = res_profile["fam"]
        _getById('otch_changeProfile').value = res_profile["otch"]
        _getById('pass_changeProfile').value = res_profile["pass"] 
        //показать текущие данные слева
        _elem('.abs_info email').textContent = res_profile["email"]
        _elem('.abs_info name').textContent = res_profile["name"]
        _elem('.abs_info fam').textContent = res_profile["fam"]
        _elem('.abs_info otch').textContent = res_profile["otch"]
        _elem('.abs_info pass').textContent = res_profile["pass"]  
    })
    //меняем данные
    _event('.btn_change_data', function(){
        let req_data = new FormData();
        req_data.append("name", _getById('name_changeProfile').value)
        req_data.append("fam", _getById('fam_changeProfile').value)
        req_data.append("otch", _getById('otch_changeProfile').value)
        req_data.append("pass", _getById('pass_changeProfile').value)
        
        _put(`${HOST}/user`, req_data, function(res_new){
            res_new = JSON.parse(res_new)
            //отображаем новые данные профиля
            _elem('.abs_info email').textContent = res_new["email"]
            _elem('.abs_info name').textContent = res_new["name"]
            _elem('.abs_info fam').textContent = res_new["fam"]
            _elem('.abs_info otch').textContent = res_new["otch"]
            _elem('.abs_info pass').textContent = res_new["pass"]  
        })
    })
}