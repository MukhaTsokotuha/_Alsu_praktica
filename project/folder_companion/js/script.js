const HOST = `http://api-messenger.web-srv.local`
var TOKEN = ''
function doAuth(){
    //_elem('header').classList.add('hidden')
    let req_data = new FormData();
    req_data.append('email','yanu@mail.com')
    req_data.append('pass', 'y')

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOST}/auth`)
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4){
            if (xhr.status == 200){
                TOKEN = JSON.parse(xhr.responseText)["Data"]["token"]
                alert(TOKEN)
            }else{
                alert(0)
            } 
        }
    } 
}
function _post(url,req_data, callback,div_block){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url)
    xhr.setRequestHeader('Authorization', 'Bearer ' +  TOKEN)
    xhr.send(req_data)
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                if (callback){
                    callback(xhr.responseText)   
                }
            }else{
                alert(0)
                 
            }
        }
    }
}

doAuth()
document.querySelector('button').addEventListener('click', function(){
    chat_id=91;
   
        //alert(2)
        let text = 'New Message'
        let req_data_mes = new FormData();
        req_data_mes.append('chat_id', chat_id)
        req_data_mes.append('text', text)
        
        _post(`${HOST}/messages`, req_data_mes, function(res){

        }, '.answer_text')

})
