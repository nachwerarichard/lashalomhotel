document.addEventListener("DOMContentLoaded", function() {
  // Simulate a delay (e.g., for loading data or assets)
  setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      document.body.style.overflow = 'auto'; // Allow scrolling again
  }, 2000); // Change this to the desired delay time
});

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
    }, 3000); // Change slide every 5 seconds
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
    }, 2000); // Change slide every 5 seconds
});
  // script.js
  document.addEventListener("DOMContentLoaded", function() {
    const elementsToAnimate = document.querySelectorAll('.hero01-content,.p');
  
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
  document.addEventListener("DOMContentLoaded", function() {
    const elementsToAnimate = document.querySelectorAll('.hotel-info ,.card,.amenity,.text-content');
  
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
    const elementsToAnimate = document.querySelectorAll('.gallery-item');
  
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
  const elementsToAnimate = document.querySelectorAll('.experience-card,.hero-content,.text-content');

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
document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.getElementById('searchBar_001');
  const searchResults = document.getElementById('searchResults_001');
  const cartIcon = document.getElementById('cartIcon');
  const cartCount = document.getElementById('cartCount');

  const menuItems = [
      { name: 'Champagne', price: 15000, category: 'Drinks' },
      { name: 'Red Wine', price: 25000, category: 'Drinks' },
      { name: 'White Wine', price: 30000, category: 'Drinks' },
      { name: 'Cocktail', price: 5000, category: 'Drinks' },
      { name: 'Grilled Salmon', price: 20000, category: 'Food' },
      { name: 'Steak', price: 6000, category: 'Food' },
      { name: 'Caesar Salad', price: 7000, category: 'Food' },
      { name: 'Pasta', price: 3000, category: 'Food' },
      { name: 'Cheese Platter', price: 10000, category: 'Other Items' },
      { name: 'Fruit Platter', price: 5000, category: 'Other Items' },
      { name: 'Chocolate Cake', price: 4000, category: 'Other Items' },
      { name: 'Ice Cream', price: 2000, category: 'Other Items' }
  ];

  let cart = [];

  searchBar.addEventListener('input', function() {
      const query = searchBar.value.toLowerCase();
      searchResults.innerHTML = '';

      if (query) {
          const filteredItems = menuItems.filter(item => 
              item.name.toLowerCase().includes(query) ||
              item.category.toLowerCase().includes(query)
          );

          

          filteredItems.forEach(item => {
              const itemElement = document.createElement('div');
              itemElement.classList.add('menu-item');
              itemElement.innerHTML = `
                  <span>${item.name}</span>
                  <span class="price">Ugsh.${item.price.toLocaleString()}</span>
              `;
              itemElement.dataset.name = item.name;
              itemElement.dataset.price = item.price;
              itemElement.addEventListener('click', addToCart);
              searchResults.appendChild(itemElement);
          });
      }
  });

  document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', addToCart);
  });

  cartIcon.addEventListener('click', function() {
      window.location.href = 'cart.html';
  });

  function addToCart(event) {
      const name = event.currentTarget.dataset.name;
      const price = event.currentTarget.dataset.price;

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({ name, price: parseInt(price), quantity: 1 });
      }

      cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(cart));
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const searchBar = document.getElementById('searchBar_002');
  const searchResults = document.getElementById('searchResults_002');

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

document.addEventListener('DOMContentLoaded', function() {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;

      cart.forEach(item => {
          totalPrice += item.price * item.quantity;
          const itemElement = document.createElement('div');
          itemElement.classList.add('cart-item');
          itemElement.innerHTML = `
              <span>${item.name}</span>
              <input type="number" value="${item.quantity}" min="1" data-name="${item.name}">
              <span class="price">Ugsh.${(item.price * item.quantity).toLocaleString()}</span>
              <button class="delete-button" data-name="${item.name}">&times;</button>
          `;
          cartItemsContainer.appendChild(itemElement);

          // Add event listener for delete button
          const deleteButton = itemElement.querySelector('.delete-button');
          deleteButton.addEventListener('click', function() {
              deleteCartItem(item.name);
          });
      });

      totalPriceElement.textContent = `Total: Ugsh. ${totalPrice.toLocaleString()}`;
  }

  function deleteCartItem(name) {
      cart = cart.filter(item => item.name !== name);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
  }

  cartItemsContainer.addEventListener('input', function(event) {
      if (event.target.type === 'number') {
          const name = event.target.dataset.name;
          const quantity = parseInt(event.target.value);
          const item = cart.find(item => item.name === name);
          if (item) {
              item.quantity = quantity;
              localStorage.setItem('cart', JSON.stringify(cart));
              renderCart();
          }
      }
  });

  document.getElementById('checkoutButton').addEventListener('click', function() {
      alert('Proceeding to payment...');
  });

  renderCart();
});

document.addEventListener('DOMContentLoaded', () => {
  const rooms = document.querySelectorAll('.room');
  rooms.forEach(room => {
      room.classList.add('animate');
  });
});

  

          document.addEventListener('DOMContentLoaded', () => {
  const rooms = document.querySelectorAll('.room');

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
          }
      });
  }, {
      threshold: 0.1
  });

  rooms.forEach(room => {
      observer.observe(room);
  });
});

document.addEventListener('scroll', function () {
  const zoomElement = document.querySelector('.p');
  const elementPosition = zoomElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (elementPosition.top < windowHeight && elementPosition.bottom > 0) {
      // Element is in the viewport
      zoomElement.style.transform = 'scale(1.5)'; // Increase size
  } else {
      // Element is out of the viewport
      zoomElement.style.transform = 'scale(1)'; // Original size
  }
});

document.addEventListener('scroll', function () {
  const zoomElement = document.querySelector('.hero-content');
  const elementPosition = zoomElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (elementPosition.top < windowHeight && elementPosition.bottom > 0) {
      // Element is in the viewport
      zoomElement.style.transform = 'scale(1)'; // Increase size
  } else {
      // Element is out of the viewport
      zoomElement.style.transform = 'scale(0.5)'; // Original size
  }
});

document.getElementById('background-video').playbackRate = 0.5; // Adjust this value as needed

const video = document.getElementById('background-video');
const pausePlayButton = document.getElementById('pause-play-button');

pausePlayButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        pausePlayButton.textContent = '❚❚';
    } else {
        video.pause();
        pausePlayButton.textContent = '►';
    }
});