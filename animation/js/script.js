k = 1
let timer = setInterval(() => {
    let array = document.querySelectorAll('.block_imgs img')
    i = 0;
    flag = 0
    console.log(getComputedStyle(array[0]).transform)
    while (flag == 0){
        if (k==1){
            array[0].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[1].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[2].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[3].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[4].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[5].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
            flag = 1
        }
        else if (k==2){
            array[5].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[0].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[1].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[2].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[3].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[4].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
              flag = 1
        }
        else if (k==3){
            array[4].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[5].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[0].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[1].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[2].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[3].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
              flag = 1
        }
        else if (k==4){
            array[3].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[4].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[5].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[0].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[1].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[2].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
              flag = 1
        }
        else if (k==5){
            array[2].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[3].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[4].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[5].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[0].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[1].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
              flag = 1
        }
        else if (k==6){
            array[1].setAttribute('style', ` transform: translateX(200px) translateY(0) translateZ(100px) rotateY(${0}deg) rotateX(0deg);`)
            array[2].setAttribute('style', ` transform: translateX(360px) translateY(0) translateZ(0px) rotateY(${i+60}deg) rotateX(0deg);`)
            array[3].setAttribute('style', ` transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(${i+120}deg) rotateX(0deg);`)
            array[4].setAttribute('style', ` transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(${i+180}deg) rotateX(0deg);`)
            array[5].setAttribute('style', ` transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(${i+240}deg) rotateX(0deg);`)
            array[0].setAttribute('style', ` transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(${i+300}deg) rotateX(0deg);`)
              flag = 1
        }
      
    }
    k+=1
    if (k==7){
        k = 1
    }
    i += 60;
    // if (k==1){
    //     array[0].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(0deg) rotateX(0deg);')
    //     array[1].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[2].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[3].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[4].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[5].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }else if (k==2){
    //     array[5].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[0].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[1].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[2].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[3].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[4].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }                      
    // else if (k==3){
    //     array[4].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[5].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[0].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[1].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[2].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[3].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }
    // else if(k==4){
    //     array[3].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[4].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[5].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[0].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[1].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[2].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }else if (k==5){
    //     array[2].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[3].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[4].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[5].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[0].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[1].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }else if (k==6){
    //     array[1].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[2].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[3].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[4].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[5].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[0].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }
    // else if (k==7){
    //     array[0].setAttribute('style', ' transform: translateX(200px) translateY(0) translateZ(100px) rotateY(360deg) rotateX(0deg);')
    //     array[1].setAttribute('style', ' transform: translateX(360px) translateY(0) translateZ(0px) rotateY(60deg) rotateX(0deg);')
    //     array[2].setAttribute('style', ' transform: translateX(360px) translateY(0px) translateZ(-190px)  rotateY(120deg) rotateX(0deg);')
    //     array[3].setAttribute('style', '  transform: translateX(180px) translateY(0px) translateZ(-280px)  rotateY(180deg) rotateX(0deg);')
    //     array[4].setAttribute('style', ' transform:  translateX(10px) translateY(0px) translateZ(-190px)  rotateY(240deg) rotateX(0deg);')
    //     array[5].setAttribute('style', ' transform: translateX(20px) translateY(0px) translateZ(0px)  rotateY(300deg) rotateX(0deg);')
    // }
    // if (i>3600){
    //     k = 0
    //     i = 0
    //     clearInterval(timer)
    // }
}, 700);