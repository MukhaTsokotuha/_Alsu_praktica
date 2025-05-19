function doMainPage(){
    
    makeChats() //получаем список чатов с обработчиками
    
    let timer = setInterval(function(){//ЗАПУСКАЕМ ТАЙМЕР
        showNewMessage()
        makeChats()
        if (flag == 1){
            clearInterval(timer)
            timedOut()  
        }
    },300)
    _event('.btn_create_chat', function(){
        let email_req = new FormData()
        email_req.append('email', _elem('.form_createChat input').value)
        _post(`${HOST}/chats`, email_req, function(res){
            _elem('.answer_text').textContent = 'Чат успешно создан'
        },'.answer_text' )
    },{once:true})
    //профиль
    _get(`${HOST}/user`, function(res){
        res = JSON.parse(res)
        _elem('.block_profile img').setAttribute('src', `${HOST}/${res.photo_link}`)
    })
    _event('header img', function(){
        doProfile()
    })
    //Удалить пользователя
    _elem('.btn_delete').addEventListener('click', function(){
        _delete(`${HOST}/user`)
        //localStorage.setItem('token', '')
        flag = 1
        timedOut()
    })
    // document.querySelector('.send_message button').addEventListener('click', function(){
    //     _get(`${HOST}/chats`,  function(response){
    //         response = JSON.parse(response)
    //         response.forEach(el => {   //ПЕРЕБИРАЕМ ЧАТЫ
              
    //             let chat_id = el["chat_id"]//ЗАПИСАЛИ ОТДЕЛЬНО ID ЧАТА
    //             alert(1)
    //             if (_getById(chat_id).className == 'chat_active'){
    //                 let text = _elem('.send_message input').value
    //                 let req_data_mes = new FormData();
    //                 req_data_mes.append('chat_id', chat_id)
    //                 req_data_mes.append('text', text)
                    
    //                 _post(`${HOST}/messages`, req_data_mes, function(res){
    //                     showMessages(chat_id)
    //                 })
    //             }
              
    //     // ////////удалить обработчик с кнопки после её нажатияи выполнения события
    //     //         document.querySelector('.send_message button').removeEventListener('click',  function(){
    //     //             let text = _elem('.send_message input').value
    //     //             let req_data_mes = new FormData();
    //     //             req_data_mes.append('chat_id', chat_id)
    //     //             req_data_mes.append('text', text)
                    
    //     //             _post(`${HOST}/messages`, req_data_mes, function(res){
    //     //                 showMessages(chat_id)
    //     //             })
    //     //         })
    //         })
    //     })
       
        
    // })
}
function showNewMessage(){
    _get(`${HOST}/chats`, function(response){
        response = JSON.parse(response)
        response.forEach(el => {   //ПЕРЕБИРАЕМ ЧАТЫ
            let chat_id = el["chat_id"]//ЗАПИСАЛИ ОТДЕЛЬНО ID ЧАТА
            //ЕСЛИ ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В ЗАПРОСЕ ОТЛИЧАЕТСЯ ОТ ТОГО, ЧТО ХРАНИТСЯ В ХРОМЕ, ТО
           
            if (el["chat_last_message"] != localStorage.getItem(chat_id) ){
                alert(1)
                let chat_with_new_message = _getById(chat_id)
                chat_with_new_message.classList.add('new_message')//выделяем красным
                chat_with_new_message.addEventListener('click', function(){//после нажатия убираем красный
                    chat_with_new_message.classList.remove('new_message')
                },{once:true})
            }
        })
    },'.answer_text')
}

function makeChats(){
   
    //получить список чатов и вывести в окно с чатами
    _get(`${HOST}/chats`, function(res_chats){
        res_chats = JSON.parse(res_chats)
        //проходимся по массиву чатов
        res_chats.forEach(element => {
            // ЕСЛИ В ДОКУМЕНТЕ НЕТ ЧАТА С ТАКИМ ID, ТО СОЗДАЁМ ЕГО (В НАЧАЛЕ НЕТ НИКАКИХ ID) 
            let chat_id = element["chat_id"]



            //alert(chat_id)
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
                change.addEventListener('click', function(){
                    changeChatName(chat_id)
                })
                //#endregion
                let point = document.createElement('div')
                point.className = 'point'
                point.setAttribute('id', `point_${chat_id}`)//присваиваем каждой метке свой id

                chatBlock.append(chatBlockText)//аппендим всё
                chatBlock.append(change)
                chatBlock.append(point)
                _elem('.list_chats').append(chatBlock)
                //#region обр. chat
                chatBlock.addEventListener('click', function(){
                    makeActiveChat(chatBlock, document.querySelectorAll('.chat'))
                    //chat_id = chatBlock.getAttribute('id')
                    _elem('.content_messages').textContent = ''
                    
                    showMessages(chat_id)//ВЫВЕСТИ СООБЩЕНИЯ 
                })
                //#endregion

                //обработчик на кнопку отправки сообшения
                sendMessages(chat_id)
            }
            
            //#region отметить непрочитанное сообщение
            
            //#endregion
            //ЗАПИСЫВАЕМ В ПАМЯТЬ БРАУЗЕРА ID ЧАТА И ВРЕМЯ ПОСЛЕДНЕГО СООБЩЕНИЯ В НЁМ
            localStorage.setItem(chat_id, element["chat_last_message"])
            // showNewMessage()
        });
    },'answer_text')
}
//#region ? ОТПРАВКА СООБЩЕНИЯ
function sendMessages(chat_id){
    
    document.querySelector('.send_message button').addEventListener('click', function(){
        if (_getById(chat_id).className == 'chat chat_active'){
            //alert(2)
            let text = _elem('.send_message input').value
            let req_data_mes = new FormData();
            req_data_mes.append('chat_id', chat_id)
            req_data_mes.append('text', text)
            
            _post(`${HOST}/messages`, req_data_mes, function(res){
                showMessages(chat_id)
            }, '.answer_text')
        }
        //    ////////удалить обработчик с кнопки после её нажатияи выполнения события
        // document.querySelector('.send_message button').removeEventListener('click',  function(){
        //       if (_getById(chat_id).className == 'chat chat_active'){
        //         //alert(2)
        //         let text = _elem('.send_message input').value
        //         let req_data_mes = new FormData();
        //         req_data_mes.append('chat_id', chat_id)
        //         req_data_mes.append('text', text)
                
        //         _post(`${HOST}/messages`, req_data_mes, function(res){
        //             showMessages(chat_id)
        //         })
        //     }
        // })
        
    })
}
//#endregion
function changeChatName(chat_id){
    _elem('.change_chatName').classList.toggle('hidden')
    document.querySelector('.change_chatName button').addEventListener('click', function(){
        let new_chatName = _elem('.change_chatName input').value
        _put(`${HOST}/chats?chat_id=${chat_id}&chat_name=${new_chatName}`, function(res){
            // if (res.status == 422){
            //     _elem('.message_change_chat').textContent = (JSON.parse(res.responseText)).message
            // }
            _getById(chat_id).textContent = new_chatName
        }, _elem('.message_change_chat'))
    }, {once:true})
}

function makeActiveChat(el, array){
    array.forEach(elem=>{
        elem.classList.remove('chat_active')
    })
    el.classList.toggle('chat_active')
}

function showUserProfile(email){
    if (email == null){
        _text('.answer_text', 'Такого пользователя не существует')
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
    //alert(el)
    _text('.content_messages','')
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