k=0
function showeTime(){
    let timer_points = setInterval(() => {
        if (k==0){
            document.querySelectorAll('.block_point p').forEach(element => {
                element.textContent = ''
            })
            k=1
        }else{
            k=0
            document.querySelectorAll('.block_point p').forEach(element => {
                element.textContent = ':'
            })
        }
    }, 500);

    let timer = setInterval(() => {

        let now_time = new Date()
        now_time = now_time.toTimeString().split(' ')[0]

        let num1 = document.querySelector('.block_time .block_hours p:nth-child(1)')
        let num2 = document.querySelector('.block_time .block_hours p:nth-child(2)')
        let num3 = document.querySelector('.block_time .block_minutes p:nth-child(1)')
        let num4 = document.querySelector('.block_time .block_minutes p:nth-child(2)')
        let num5 = document.querySelector('.block_time .block_seconds p:nth-child(1)')
        let num6 = document.querySelector('.block_time .block_seconds p:nth-child(2)')


        if (num1.textContent != now_time[0]){
            rotate_num(now_time[0],num1)
        }
            if (num2.textContent != now_time[1]){
            rotate_num(now_time[1],num2)
        }

        if (num3.textContent != now_time[3]){
            rotate_num(now_time[3],num3)
        }

        if ( num4.textContent != now_time[4]){
            rotate_num(now_time[4],  num4)
        }

        if (num5.textContent != now_time[6]){
            rotate_num(now_time[6],num5)
        }
        num6.textContent = now_time[7]
    }, 100);
    function rotate_num(new_num, element){
        element.setAttribute('style', 'transform: rotateY(90deg);')
        setTimeout(() => {element.setAttribute('style', 'transform: rotateY(0deg);');element.textContent = new_num }, 400)
    }
}

function doTimer(){
    let minutes = document.querySelector('.block_minutes input').value
    let seconds = document.querySelector('.block_seconds input').value
    let timer = setInterval(() => {
        console.log(timer)
        if (timer == seconds){
            clearInterval(timer)
            console.log('end')
        }
    }, 1000);
    if (minutes == '0' || ~ minutes){
        console.log(0)
    }
}
doTimer()