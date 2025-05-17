function doReg(){
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