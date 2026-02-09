        const API_BASE_URL = 'https://patrinahhotelpms.onrender.com/api';
        
        // Elements
        const container = document.getElementById('availableRoomTypesContainer');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const checkAvailabilityBtn = document.getElementById('checkAvailabilityBtn');
        const availabilityResultsSection = document.getElementById('availabilityResults');

        const bookingCheckInInput = document.getElementById('bookingCheckIn');
        const bookingCheckOutInput = document.getElementById('bookingCheckOut');
        const bookingPeopleInput = document.getElementById('bookingPeople');

        const publicMessageBox = document.getElementById('publicMessageBox');
const publicMessageBoxTitle = document.getElementById('publicMessageBoxTitle');
const publicMessageBoxContent = document.getElementById('publicMessageBoxContent');

        const checkInDateInput = document.getElementById('checkInDate');
        const checkOutDateInput = document.getElementById('checkOutDate');
       const numberOfPeopleInput = document.getElementById('numberOfPeople');


        let availableRoomsBySelectedType = {};

        // Carousel Scroll Logic
        prevBtn.addEventListener('click', () => {
            container.scrollLeft -= 300;
        });

        nextBtn.addEventListener('click', () => {
            container.scrollLeft += 300;
        });

        // Availability Logic
        checkAvailabilityBtn.addEventListener('click', async () => {
            const checkIn = document.getElementById('checkInDate').value;
            const checkOut = document.getElementById('checkOutDate').value;
            const roomType = document.getElementById('roomTypeSelect').value;
            const people = document.getElementById('numberOfPeople').value;

            if (!checkIn || !checkOut) return alert("Please select dates");

            try {
                const response = await fetch(`${API_BASE_URL}/public/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${roomType}&people=${people}`);
                availableRoomsBySelectedType = await response.json();

                container.innerHTML = '';
                const keys = Object.keys(availableRoomsBySelectedType);

                if (keys.length > 0) {
                    availabilityResultsSection.style.display = 'block';
                    // Add a simple mapping object
const roomImages = {
    "Delux 1": "multimedia/pics/room_1_a.jpg",
    "Delux 2": "multimedia/pics/room_2_a.jpg",
    "Junior suit": "multimedia/pics/room_2_b.jpg",
    "Delux suit": "multimedia/pics/room_2_b.jpg"
};

keys.forEach(type => {
    const rooms = availableRoomsBySelectedType[type];
    // Get the image URL from our mapping, or use a default placeholder
    const imageUrl = roomImages[type] || "multimedia/pics/room_1_a.jpg";

   if (rooms.length > 0) {
    const card = document.createElement('div');
    // Flex-shrink-0 ensures cards don't squish in the horizontal scroll
    card.className = 'min-w-[280px] sm:min-w-[320px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 snap-start flex-shrink-0 group';
    
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${imageUrl}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" alt="${type}">
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                 <p class="text-[10px] font-bold uppercase tracking-wider text-slate-700">${rooms.length} Available</p>
            </div>
        </div>
        
        <div class="p-5">
            <h4 class="text-lg font-semibold text-slate-900 mb-1">${type}</h4>
            
            <div class="flex items-center gap-4 mb-5">
                <div class="flex items-center text-slate-500 text-sm">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Up to 2 Guests</span>
                </div>
            </div>

            <button class="book-now-btn w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm" data-type="${type}">
                Select Room
            </button>
        </div>
    `;
    container.appendChild(card);
}
});
                    document.querySelectorAll('.book-now-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => handleBookNow(e.target.dataset.type));
                    });
                } else {
                    document.getElementById('noAvailabilityMessage').style.display = 'block';
                }
            } catch (error) {
                console.error(error);
            }
        });

function calculateNights(checkInStr, checkOutStr) {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    if (checkIn && checkOut && checkOut > checkIn) {
        const diffTime = Math.abs(checkOut - checkIn);
        // Convert milliseconds to days
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
}
        
        function handleBookNow(type) {
        const availableRooms = availableRoomsBySelectedType[type];
    // 1. Get the dates from the input elements
    const checkInStr = document.getElementById('checkInDate').value;
    const checkOutStr = document.getElementById('checkOutDate').value;

    // 2. Calculate the number of nights
    const nights = calculateNights(checkInStr, checkOutStr);

    if (nights <= 0) {
        alert("Please select valid check-in and check-out dates first.");
        return;
    }

    // 3. Define prices (Update these to match your actual rates)
    const priceList = {
        "Standard": 100.00,
        "Deluxe": 150.00,
        "Suite": 250.00,
        "Any": 100.00 // Default fallback
    };

    // Get price based on type, or use 100 as a default if type isn't found
    const ratePerNight = priceList[type] || 100.00;
    const totalDue = (nights * ratePerNight).toFixed(2);

 bookingCheckInInput.value = checkInDateInput.value;
    bookingCheckOutInput.value = checkOutDateInput.value;
    bookingPeopleInput.value = numberOfPeopleInput.value;

            
            const rooms = availableRoomsBySelectedType[type];
            document.getElementById('selectedRoomTypeDisplay').textContent = type;
            document.getElementById('availabilityResults').style.display = 'none';
            document.getElementById('guestDetailsForm').style.display = 'block';
            

    // 5. Update the UI Display
    document.getElementById('selectedRoomTypeDisplay').textContent = type;
    document.getElementById('finalTotalDue').textContent = totalDue;
    document.getElementById('bookingTotalDue').value = totalDue;

    // 6. Switch Views
    document.getElementById('availabilityResults').style.display = 'none';
    document.getElementById('guestDetailsForm').style.display = 'block';
    
    // Scroll to the form
    document.getElementById('guestDetailsForm').scrollIntoView({ behavior: 'smooth' });
}
        // Initialize room types (Simplified for brevity)
        async function init() {
            const res = await fetch(`${API_BASE_URL}/public/room-types`);
            const types = await res.json();
            const select = document.getElementById('roomTypeSelect');
            types.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t; opt.textContent = t;
                select.appendChild(opt);
            });
        }
        init();

        function closePublicMessageBox() { document.getElementById('publicMessageBox').style.display = 'none'; }
        


        // Add this logic to your script section
const cancelBookingBtn = document.getElementById('cancelBookingBtn');
const guestDetailsFormSection = document.getElementById('guestDetailsForm');

cancelBookingBtn.addEventListener('click', () => {
    // 1. Hide the guest details form
    guestDetailsFormSection.style.display = 'none';

    // 2. Show the room results (carousel) again
    availabilityResultsSection.style.display = 'block';

    // 3. Optional: Clear the guest form fields so they are fresh for next time
    document.getElementById('publicBookingForm').reset();
    
    // 4. Scroll back to the room results smoothly
    availabilityResultsSection.scrollIntoView({ behavior: 'smooth' });
});

        document.addEventListener('DOMContentLoaded', () => {
            const checkInDateInput = document.getElementById('checkInDate');
            const checkOutDateInput = document.getElementById('checkOutDate');
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    checkInDateInput.min = todayFormatted;
    checkOutDateInput.min = todayFormatted; // Check-out cannot be before check-in

    // Update check-out min date when check-in changes
    checkInDateInput.addEventListener('change', () => {
        if (checkInDateInput.value) {
            checkOutDateInput.min = checkInDateInput.value;
            // If check-out is earlier than new check-in, reset it
            if (checkOutDateInput.value && new Date(checkOutDateInput.value) < new Date(checkInDateInput.value)) {
                checkOutDateInput.value = checkInDateInput.value;
            }
        }
    });

    populateRoomTypeDropdown();
});

        async function populateRoomTypeDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/public/room-types`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const types = await response.json();
        allRoomTypes = types; // Store all room types

        roomTypeSelect.innerHTML = '<option value="Any">Any Type</option>'; // Keep "Any Type" option
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            roomTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching room types:', error);
        showPublicMessageBox('Error', 'Failed to load room types. Please try again later.', true);
    }
}

        // --- Guest Details and Booking Submission ---


        function showPublicMessageBox(title, message, isError = false) {
                publicMessageBoxContent.textContent = message;
    
    publicMessageBox.classList.remove('error-message', 'success-message');
    if (isError) {
        publicMessageBox.classList.add('error-message');
    } else {
        publicMessageBox.classList.add('success-message');
    }
    publicMessageBox.style.display = 'block';
}

 let selectedRoomsCart = []; // To store { type, people, price }

function handleBookNow(type) {
    const people = document.getElementById('numberOfPeople').value;
    const checkInStr = document.getElementById('checkInDate').value;
    const checkOutStr = document.getElementById('checkOutDate').value;
    const nights = calculateNights(checkInStr, checkOutStr);

    const priceList = { "Delux 1": 100, "Delux 2": 150, "Junior suit": 200, "Delux suit": 250 };
    const rate = priceList[type] || 100;

    // Add to cart
    selectedRoomsCart.push({
        type: type,
        people: parseInt(people),
        price: rate * nights
    });

    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const cartSection = document.getElementById('selectedRoomsCart');
    cartList.innerHTML = '';
    
    let total = 0;
    selectedRoomsCart.forEach((item, index) => {
        total += item.price;
        cartList.innerHTML += `<li>${item.type} (${item.people} guests) - $${item.price} 
            <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer;">[Remove]</button></li>`;
    });

    document.getElementById('finalTotalDue').textContent = total.toFixed(2);
    cartSection.style.display = 'block';
    document.getElementById('guestDetailsForm').style.display = 'block';
    document.getElementById('availabilityResults').style.display = 'none';
}

function removeFromCart(index) {
    selectedRoomsCart.splice(index, 1);
    if(selectedRoomsCart.length === 0) {
        document.getElementById('guestDetailsForm').style.display = 'none';
        document.getElementById('selectedRoomsCart').style.display = 'none';
        document.getElementById('availabilityResults').style.display = 'block';
    } else {
        renderCart();
    }
}

// Logic for "Add Another Room"
document.getElementById('addMoreRoomsBtn').addEventListener('click', () => {
    document.getElementById('availabilityResults').style.display = 'block';
    document.getElementById('guestDetailsForm').style.display = 'none';
});

// Update the Form Submission
publicBookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const bookingData = {
        name: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        phoneNo: document.getElementById('guestPhoneNo').value,
        checkIn: document.getElementById('checkInDate').value,
        checkOut: document.getElementById('checkOutDate').value,
        roomsRequested: selectedRoomsCart // Sending the array
    };

// More client-side validation for guest details
    if (!bookingData.name || !bookingData.phoneNo || !bookingData.guestEmail) { // Added email validation
        showPublicMessageBox('Validation Error', 'Full Name, Email Address, and Phone Number are required.', true);
        return;
    }
    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(bookingData.guestEmail)) {
        showPublicMessageBox('Validation Error', 'Please enter a valid email address.', true);
        return;
    }

    showPublicMessageBox('Booking...', 'Confirming your booking and sending confirmation. Please wait...');
    try {
        const response = await fetch(`${API_BASE_URL}/public/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const confirmedBookings = result.bookings; // Note the 's' - it's an array

// Create a string of all room numbers booked
        const bookedRoomNumbers = confirmedBookings.map(b => b.room).join(', ');

        // --- Send Email Confirmation ---
        // We'll use the /public/send-booking-confirmation endpoint
        // This endpoint expects the entire booking object in its body,
        // which matches the `confirmedBooking` structure.
        
                   showPublicMessageBox('Success!', `Booking confirmed! We look forward to seeing you.`);

        // Reset the form and hide sections after successful booking
        publicBookingForm.reset();
        checkInDateInput.value = '';
        checkOutDateInput.value = '';
        roomTypeSelect.value = 'Any';
        numberOfPeopleInput.value = '1';

        guestDetailsFormSection.style.display = 'none';
        availabilityResultsSection.style.display = 'none';

    
    } catch (error) {
        console.error(error);
    }
});



