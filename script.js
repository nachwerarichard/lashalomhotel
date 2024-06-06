
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});



let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
}

function currentSlide(index) {
    showSlide(index - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlideIndex);
    setInterval(() => {
        currentSlide((currentSlideIndex + 1) % slides.length + 1);
    }, 5000); // Change slide every 5 seconds
});



let currentTestimonialIndex = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-carousel .carousel-slide01');
const testimonialDots = document.querySelectorAll('.testimonial-carousel .dot01');

function showTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentTestimonialIndex = index;
}

function currentTestimonial(index) {
    showTestimonial(index - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    showTestimonial(currentTestimonialIndex);
    setInterval(() => {
        currentTestimonial((currentTestimonialIndex + 1) % testimonialSlides.length + 1);
    }, 5000); // Change slide every 5 seconds
});

