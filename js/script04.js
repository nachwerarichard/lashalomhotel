
document.addEventListener('DOMContentLoaded', function() {
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const carouselImages = document.querySelector('.carousel-images');
let index = 0;

function showImage(index) {
const width = carouselImages.clientWidth;
carouselImages.style.transform = `translateX(${-index * width}px)`;
}

prevBtn.addEventListener('click', function() {
index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
showImage(index);
});

nextBtn.addEventListener('click', function() {
index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
showImage(index);
});
});

