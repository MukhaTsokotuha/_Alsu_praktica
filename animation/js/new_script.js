// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');
// const radius = 100;
// const images = [];
// const numImages = 6; // Количество изображений
// const angleStep = Math.PI * 2 / numImages;

// // Загрузка изображений (пример, нужно реализовать реальную загрузку)
// for (let i = 1; i < numImages; i++) {
//   const img = new Image();
//   img.src = `images/${i}.jpg`; // Замените на реальные пути к изображениям
//   images.push(img);
// }

// const particles = [];

// // Создание точек на сфере
// function createParticles() {
//     for (let i = 0; i < numImages; i++) {
//         const theta = i * angleStep;
//         const phi = 0; // Здесь можно добавить дополнительное вращение
//         const x = radius * Math.sin(theta) * Math.cos(phi);
//         const y = radius * Math.sin(theta) * Math.sin(phi);
//         const z = radius * Math.cos(theta);
//         particles.push({
//             x: x,
//             y: y,
//             z: z,
//             imageIndex: i
//         });
//     }
// }

// createParticles();

// // Анимация
// function animate() {
//     requestAnimationFrame(animate);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Обновляем координаты
//     particles.forEach(particle => {
//         // Можем двигать по сфере
//         particle.x = radius * Math.sin(particle.angle) * Math.cos(particle.phi);
//         particle.y = radius * Math.sin(particle.angle) * Math.sin(particle.phi);
//         particle.z = radius * Math.cos(particle.angle);
//     });

//     // Переводим в экранные координаты (3D в 2D)
//     particles.forEach(particle => {
//         // Замените на реальную проекцию
//         const x = particle.x + canvas.width / 2;
//         const y = particle.y + canvas.height / 2;
//         ctx.drawImage(images[particle.imageIndex], x - 50, y - 50, 100, 100); // Размер картинки
//     });
// }

// // Начало анимации
// requestAnimationFrame(animate);

element = document.querySelector('.block')
duration = 3000
let zero;

requestAnimationFrame(firstFrame);
function firstFrame(timestamp) {
      console.log(timestamp, zero)
  zero = timestamp;
  animate(timestamp);
}
function animate(timestamp) {
  const value = (timestamp - zero) / duration;
  console.log(timestamp)
  if (value < 1) {
    element.style.opacity = value;
    requestAnimationFrame((t) => animate(t));
  } else element.style.opacity = 1;
}


// const zero = performance.now();
// requestAnimationFrame(animate);
// function animate() {
//   const value = (performance.now() - zero) / duration;
//   if (value < 1) {
//     element.style.opacity = value;
//     requestAnimationFrame((t) => animate(t));
//   } else element.style.opacity = 1;
// }