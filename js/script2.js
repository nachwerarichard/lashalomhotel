document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_01');
    const nextBtn = document.querySelector('.next_01');
    const carouselImages = document.querySelector('.carousel-images_01');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_02');
    const nextBtn = document.querySelector('.next_02');
    const carouselImages = document.querySelector('.carousel-images_02');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_03');
    const nextBtn = document.querySelector('.next_03');
    const carouselImages = document.querySelector('.carousel-images_03');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_04');
    const nextBtn = document.querySelector('.next_04');
    const carouselImages = document.querySelector('.carousel-images_04');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_05');
    const nextBtn = document.querySelector('.next_05');
    const carouselImages = document.querySelector('.carousel-images_05');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.querySelector('.prev_06');
    const nextBtn = document.querySelector('.next_06');
    const carouselImages = document.querySelector('.carousel-images_06');
    let index = 0;

    function showImage(index) {
        const images = carouselImages.children;
        const totalImages = images.length;
        const width = carouselImages.parentElement.clientWidth;
        
        // Set the width of the carousel images container
        carouselImages.style.width = `${totalImages * 100}%`;
        
        // Set the width of each image
        Array.from(images).forEach(img => {
            img.style.width = `${width}px`;
        });

        carouselImages.style.transform = `translateX(${-index * width}px)`;
    }

    function nextImage() {
        index = (index < carouselImages.children.length - 1) ? index + 1 : 0;
        showImage(index);
    }

    function prevImage() {
        index = (index > 0) ? index - 1 : carouselImages.children.length - 1;
        showImage(index);
    }

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Initialize carousel
    showImage(index);

    // Make carousel continuous
    setInterval(nextImage, 3000); // Change image every 3 seconds
});
document.addEventListener('DOMContentLoaded', function () {
    const carouselImages = document.querySelector('.carousel-images_01');
    const images = carouselImages.querySelectorAll('img');
    const prevButton = document.querySelector('.prev_01');
    const nextButton = document.querySelector('.next_01');
    let currentIndex = 0;

    function updateCarousel() {
        const width = images[0].clientWidth;
        carouselImages.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    prevButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
});