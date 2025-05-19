function doMainPage(){
    //получаем список чатов
    makeChats()  
}

function makeChats(){
    //получаем список чатов и выводим в окно с чатами
    _get(`${HOST}/chats`, function(res_chats){
        res_chats = JSON.parse(res_chats)
        //проходимся по массиву чатов
        res_chats.forEach(element => {
            //создаём блоки с чатами
            let chatBlock = document.createElement('div')
            chatBlock.className = 'block_chat';
            chatBlock.setAttribute('id', element.chat_id)//каждому чату свой id
            let chatBlockText = document.createElement('p')
            //отображаем название чата
            chatBlockText.textContent = element.chat_name; 
            chatBlock.append(chatBlockText)

            _elem('.list_chats').append(chatBlock)//аппендим каждый блок чата в список чатов
        });
    })

    //навешиваем обаботчики на чаты
    document.querySelectorAll('.block_chat').forEach(el => {

        //при нажатии на блок чата выводим сообщения в диалоговое окно
        el.addEventListener('click', function(){
            //очищаем окно с сообщениями
            _elem('.block_messages').textContent = '';

            _get(`${HOST}/messages/?chat_id=${el.id}`, function(res_messages){
                //если email совпадает с моим, то 
                if(res_messages["sender"]["email"] == MyEmail){
                    //создаём сообщение с классом message_1
                    let message_block = document.createElement('div')
                    message_block.className='message_1'

                    //записываем текст сообщения
                    let message_block_text = document.createElement('p')
                    message_block_text.textContent = res_messages.text

                    //аппендим всё
                    message_block.append(message_block_text)
                    _elem('.block_messages').append(message_block)

                //сообщения собеседника
                }else{                                              
                    //создаём сообщение с классом message_2
                    let message_block = document.createElement('div')
                    message_block.className='message_2'

                    //записываем текст сообщения
                    let message_block_text = document.createElement('p')
                    message_block_text.textContent = res_messages.text

                    //аппендим всё
                    message_block.append(message_block_text)
                    _elem('.block_messages').append(message_block)
                }
            })//get
        })//el.addEvent
    })//qSAll(.block_chat)
}