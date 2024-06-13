
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
    const elementsToAnimate = document.querySelectorAll('.hero01-content, .cta-buttons');
  
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
   document.addEventListener("DOMContentLoaded", function() {
    const elementsToAnimate = document.querySelectorAll('.gallery');
  
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
   document.addEventListener("DOMContentLoaded", function() {
    const elementsToAnimate = document.querySelectorAll('.amenities-section');
  
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
 document.addEventListener("DOMContentLoaded", function() {
  const elementsToAnimate = document.querySelectorAll('.experiences-section,.hero-content');

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
document.addEventListener("DOMContentLoaded", function() {
    const slideInElements = document.querySelectorAll('.content-section,.carousel,.hero01,.contact-us,.video-section');
  
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
  
  document.addEventListener("DOMContentLoaded", function() {
    const slideInElements = document.querySelectorAll('.room-info,.carousel,.experiences-section,.video-section,.testimonial-carousel');
  
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
  
  document.addEventListener("DOMContentLoaded", function() {
    const slideInElements = document.querySelectorAll('.content-section,.booking-container,.hero01,.contact-us');
  
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
  



  document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');

    const rooms = [
        {
            name: 'Deluxe Suite',
            price: '$299 per night',
            amenities: ['Free Wi-Fi', 'King-size bed', 'En-suite bathroom', '24-hour room service', 'Complimentary breakfast', '2 people'],
            image: 'multimedia/pics/slider_1.jpg',
            id: 'content1'
        },
        {
            name: 'Executive Suite',
            price: '$299 per night',
            amenities: ['Free Wi-Fi', 'King-size bed', 'En-suite bathroom', '24-hour room service', 'Complimentary breakfast', '3 people'],
            image: 'multimedia/pics/slider_1.jpg',
            id: 'content2'
        },
        {
            name: 'Presidential Suite',
            price: '$299 per night',
            amenities: ['Free Wi-Fi', 'King-size bed', 'En-suite bathroom', '24-hour room service', 'Complimentary breakfast', '1 person'],
            image: 'multimedia/pics/slider_1.jpg',
            id: 'content3'
        },
        {
            name: 'Double Room',
            price: '$299 per night',
            amenities: ['Free Wi-Fi', 'King-size bed', 'En-suite bathroom', '24-hour room service', 'Complimentary breakfast', '2 people'],
            image: 'multimedia/pics/slider_1.jpg',
            id: 'content4'
        }
    ];

    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query) {
            const filteredRooms = rooms.filter(room => 
                room.name.toLowerCase().includes(query) ||
                room.amenities.some(amenity => amenity.toLowerCase().includes(query))
            );

            filteredRooms.forEach(room => {
                const roomElement = document.createElement('div');
                roomElement.classList.add('room-info');
                roomElement.innerHTML = `
                    <div class="room-details">
                      <h2>${room.name}</h2>
                      <p class="price">${room.price}</p>
                      <p class="description">Experience the ultimate in luxury and comfort in our ${room.name}, featuring stunning views and top-of-the-line amenities.</p>
                      <ul class="amenities01">
                        ${room.amenities.map(amenity => `<li>${amenity}</li>`).join('')}
                      </ul>
                      <button class="book-now"><a href="booking.html">Book Now</a></button>
                    </div>
                    <div class="room-image">
                      <img src="${room.image}" alt="${room.name}">
                    </div>
                `;
                searchResults.appendChild(roomElement);
            });
        }
    });
});