function doAuth(){
    console.log(1)
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
    // _get(`${HOST}/user`, function(res){
    //     res = JSON.parse(res)
    //     console.log(res)
    //     var MyEmail = res["email"]
    // })
    _event('.btn_reg', function(){
        _load('html/registration.html', doReg)
    })
}