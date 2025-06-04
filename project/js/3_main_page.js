

function doMainPage(){
    document.title = 'Сообщения'
    flag=0
    showNewMessage()
    makeChats() //получаем список чатов с обработчиками
 
    let timer = setInterval(function(){//ЗАПУСКАЕМ ТАЙМЕР
     
        makeChats()
         
        if (flag == 1){
            clearInterval(timer)
            timedOut()  
        }
    },300)
    _event('.btn_create_chat', function(){
        _text('.answer_text', '')
        let email_req = new FormData()
        email_req.append('email', _elem('.form_createChat input').value)
        _post(`${HOST}/chats`, email_req, function(res){
            _elem('.answer_text').textContent = 'Чат успешно создан'
         
        },'.answer_text' )
    },{once:true})
    //профиль
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)

        _text('.user_name', res.name)
        _elem('.block_profile img').setAttribute('src', `${HOST}/${res.photo_link}`)
    })
    _event('.block_profile img', function(){
        doProfile()
    })
    //Удалить пользователя
    _elem('.btn_delete').addEventListener('click', function(){
        _delete(`${HOST}/user`)
        //localStorage.setItem('token', '')
        flag = 1
        timedOut()
    })
}
function showNewMessage(){
     var list = document.querySelector('link[rel="icon"]');
    _get(`${HOST}/chats`, function(response){
        response = JSON.parse(response)
        response.forEach(el => {   //ПЕРЕБИРАЕМ ЧАТЫ
            let chat_id = el["chat_id"]//ЗАПИСАЛИ ОТДЕЛЬНО ID ЧАТА
            //ЕСЛИ ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В ЗАПРОСЕ ОТЛИЧАЕТСЯ ОТ ТОГО, ЧТО ХРАНИТСЯ В ХРОМЕ, ТО
            if (el["chat_last_message"] != localStorage.getItem(chat_id) ){
                showMessages(chat_id)
                makeActiveChat(_getById(chat_id), chat_id)
                let chat_with_new_message = _getById(chat_id)
                chat_with_new_message.classList.add('new_message')//выделяем красным
                chat_with_new_message.addEventListener('click', function(){//после нажатия убираем красный
                    chat_with_new_message.classList.remove('new_message')
                    list.removeAttribute('href')
                     list.setAttribute('href', 'images/l2.png');
                })
                document.title = 'Новое сообщение'
               
                list.setAttribute('href', 'images/конверт.png');
            }
            localStorage.setItem(chat_id, el["chat_last_message"])
        })
        
    },'.answer_text')
}

function makeChats(){
    document.title = 'Сообщения'
    //получить список чатов и вывести в окно с чатами
    _get(`${HOST}/chats`, function(res_chats){
        res_chats = JSON.parse(res_chats)
        //проходимся по массиву чатов
        res_chats.forEach(element => {
            // ЕСЛИ В ДОКУМЕНТЕ НЕТ ЧАТА С ТАКИМ ID, ТО СОЗДАЁМ ЕГО (В НАЧАЛЕ НЕТ НИКАКИХ ID) 
            let chat_id = element["chat_id"]
            
            if (!(document.getElementById(chat_id))){
                //создаём блоки с чатами
                let chatBlock = document.createElement('div')
                chatBlock.className = 'chat';

                chatBlock.setAttribute('id', chat_id)//каждому чату свой id
                let chatBlockText = document.createElement('p')
                chatBlockText.setAttribute('id', element["companion_email"])
                chatBlockText.textContent = element.chat_name;
                //#region обр. chat p
                chatBlockText.addEventListener('click', function(){
                    showUserProfile(element["companion_email"])
                })
                //#endregion
                let change = document.createElement('div')
                change.className = 'change'
                //#region обр. change
                change.setAttribute('class', 'change')
                change.setAttribute('title','Изменить имя чата')
                change.addEventListener('click', function(){
                    changeChatName(chat_id, chatBlock)
                })
                //#endregion
               
              

                chatBlock.append(chatBlockText)//аппендим всё
                chatBlock.append(change)
             
                _elem('.list_chats').append(chatBlock)
                //#region обр. chat
                chatBlock.addEventListener('click', function(){
                    makeActiveChat(chatBlock,chat_id)
                    //chat_id = chatBlock.getAttribute('id')
                    _elem('.content_messages').textContent = ''
                  
                    showMessages(chat_id)//ВЫВЕСТИ СООБЩЕНИЯ 
                })

                //#endregion

                //обработчик на кнопку отправки сообшения
                sendMessages(chat_id)
            }
            showNewMessage()
            //ЗАПИСЫВАЕМ В ПАМЯТЬ БРАУЗЕРА ID ЧАТА И ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В НЁМ
           
        });
    },'answer_text')
}
//#region ? ОТПРАВКА СООБЩЕНИЯ
function sendMessages(chat_id){
    _elem('.content_messages').textContent = ''
 
    document.querySelector('.send_message button').addEventListener('click', function(){
        if (_getById(chat_id).className == 'chat chat_active'){
         
            let text = _elem('.send_message input').value
            let req_data_mes = new FormData();
            req_data_mes.append('chat_id', chat_id)
            req_data_mes.append('text', text)
            
            _post(`${HOST}/messages`, req_data_mes, function(res){
                 _elem('.content_messages').textContent = ''
                showMessages(chat_id)
            }, '.answer_text')
        }
    })
    // document.querySelector('.send_message input').addEventListener('click', function(){

    //     document.addEventListener('keydown', function(e){
    //         if ((e.code == 'Enter')){
    //             if (_getById(chat_id).className == 'chat chat_active'){
            
    //                 let text = _elem('.send_message input').value
    //                 let req_data_mes = new FormData();
    //                 req_data_mes.append('chat_id', chat_id)
    //                 req_data_mes.append('text', text)
                    
    //                 _post(`${HOST}/messages`, req_data_mes, function(res){
    //                     _elem('.content_messages').textContent = ''
    //                     showMessages(chat_id)
    //                 }, '.answer_text')
    //             }
    //         }
    //     }, {once:true})
    // })

}
//#endregion
function changeChatName(chat_id, chatBlock){
    _elem('.change_chatName').classList.toggle('hidden')
    document.querySelector('.change_chatName button').addEventListener('click', function(){
        let new_chatName = _elem('.change_chatName input').value
        _put(`${HOST}/chats?chat_id=${chat_id}&chat_name=${new_chatName}`, function(res){
            // if (res.status == 422){
            //     _elem('.message_change_chat').textContent = (JSON.parse(res.responseText)).message
            // }
            _getById(chat_id).textContent = new_chatName
            _elem('.change_chatName').classList.toggle('hidden')
            let change = document.createElement('div')
            change.className = 'change'

            change.setAttribute('class', 'change')
            change.setAttribute('title','Изменить имя чата')
            change.addEventListener('click', function(){
                changeChatName(chat_id)
            })
            chatBlock.append(change)
        }, _elem('.message_change_chat'))
    })
   
}

function makeActiveChat(el,chat_id){
    document.querySelectorAll('.chat').forEach(elem=>{
        elem.classList.remove('chat_active')
    })
    el.classList.toggle('chat_active')
    //localStorage.setItem('current_chat', chat_id)
}

function showUserProfile(email){
    if (email == null){
        alert('Такого пользователя не существует')
    }else{
        _elem('.page_profile').classList.toggle('hidden')
        _elem('.section').classList.toggle('brightness')
        _elem('header').classList.toggle('brightness')
        _get(`${HOST}/user/?email=${email}`, function(res){
            res = JSON.parse(res)
            //_elem('.page_profile img').setAttribute('src', res["photo_link"])
            _elem('.page_profile img').setAttribute('src', `${HOST}/${res.photo_link}`)
            _elem('.page_profile .name').textContent = res["name"]
            _elem('.page_profile .fam').textContent = res["fam"]
            _elem('.page_profile .otch').textContent = res["otch"]
            _elem('.page_profile .email').textContent = email
            _event('.back_profile', function(){
                _elem('.page_profile').classList.add('hidden')
                _elem('.section').classList.remove('brightness')
                _elem('header').classList.remove('brightness')
            })
        },'.answer_text') 
    }
   
}

function showMessages(el){
     _elem('.content_messages').textContent = ''
    _get(`${HOST}/messages/?chat_id=${el}`, function(res_messages){
                   
        res_messages = JSON.parse(res_messages)
   
            
        res_messages.forEach(element => {
            //если email совпадает с моим, то 
            if(element["sender"]["email"] == localStorage.getItem('myEmail')){
                //создаём сообщение с классом message_1
                let message_block = document.createElement('div')
                message_block.className='my_message'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
               
                message_block_text.textContent = element.text
                 message_block_text.clasName = 'message_p'

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.content_messages').append(message_block)

            //сообщения собеседника
            }else{                                              
                //создаём сообщение с классом message_2
                let message_block = document.createElement('div')
                message_block.className='companion_message'

                //записываем текст сообщения
                let message_block_text = document.createElement('p')
           
                message_block_text.textContent = element.text
                 message_block_text.clasName = 'message_p'

                //аппендим всё
                message_block.append(message_block_text)
                _elem('.content_messages').append(message_block)
            }
        })//--FOREACH
    },'.answer_text')
}