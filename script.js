
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});
document.addEventListener('DOMContentLoaded', () => {
hamburger.addEventListener('click', () => {
document.querySelector('.hero').classList.toggle('blurred');
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


// script.js
document.addEventListener("DOMContentLoaded", function() {
    const slideInElements = document.querySelectorAll('.cards,.hero01,.contact-us,.content-section,.gallery,.experiences-section,.amenities-section,.video-section,.testimonial-carousel,.carousel');
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    slideInElements.forEach(element => {
      observer.observe(element);
    });
  });
  

  // script.js
document.addEventListener("DOMContentLoaded", function() {
    const elementsToAnimate = document.querySelectorAll('.booking-container,.hero-content,.hero01-content, .cta-buttons,.room-info');
  
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    elementsToAnimate.forEach(element => {
      observer.observe(element);
    });
  });
  

  // script.js
// script.js
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const playButton = document.getElementById('playButton');
  
    playButton.addEventListener('click', function() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  
    video.addEventListener('play', function() {
      playButton.style.display = 'none';
      video.setAttribute('controls', 'controls');
    });
  
    video.addEventListener('pause', function() {
      playButton.style.display = 'block';
    });
  
    // Show play button initially if the video is paused
    if (video.paused) {
      playButton.style.display = 'block';
    }
  });
  
  document.getElementById('booknow').addEventListener('click', function() {
    window.location.href = 'booking.html';
});

document.getElementById('about0123').addEventListener('click', function() {
  window.location.href = 'rooms.html';
});

document.getElementById('about0100').addEventListener('click', function() {
  window.location.href = 'about.html';
});
document.getElementById('booknow').addEventListener('click', function() {
  window.location.href = 'booking.html';
});
document.getElementById('details').addEventListener('click', function() {
  window.location.href = 'details.html';
});
document.getElementById('room100').addEventListener('click', function() {
  window.location.href = 'rooms.html';
});
document.getElementById('exeperience100').addEventListener('click', function() {
  window.location.href = 'experience.html';
});
document.getElementById('gallery01').addEventListener('click', function() {
  window.location.href = 'gallery.html';
});
  
  
  

