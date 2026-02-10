        const API_BASE_URL = 'https://patrinahhotelpms.onrender.com/api';
       let availableRoomsBySelectedType = {};
let selectedRoomsCart = [];
let roomTypeDetails = []; // NEW: To store the full objects (price, image)
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

            keys.forEach(typeName => {
                const roomData = availableRoomsBySelectedType[typeName];
                
                // FIND the details for this specific type from our saved array
                const detail = roomTypeDetails.find(d => d.name === typeName) || {};
                
                // Use backend image or a placeholder if missing
                const imageUrl = detail.imageUrl || "multimedia/pics/room_1_a.jpg";
                const pricePerNight = detail.basePrice || 0;

                if (roomData.rooms.length > 0) {
                    const card = document.createElement('div');
                    card.className = 'min-w-[280px] sm:min-w-[320px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 snap-start flex-shrink-0 group';
                    
                    card.innerHTML = `
                        <div class="relative overflow-hidden">
                            <img src="${imageUrl}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" alt="${typeName}">
                            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                                 <p class="text-[10px] font-bold uppercase tracking-wider text-slate-700">${roomData.rooms.length} Available</p>
                            </div>
                        </div>
                        <div class="p-5">
                            <h4 class="text-lg font-semibold text-slate-900 mb-1">${typeName}</h4>
                            <p class="text-indigo-600 font-bold mb-4">UGX ${pricePerNight.toLocaleString()}</p>
                            <button class="book-now-btn w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm" 
                                    onclick="handleBookNow('${typeName}')">
                                Select Room
                            </button>
                        </div>
                    `;
                    container.appendChild(card);
                }
            });
        } else {
            document.getElementById('noAvailabilityMessage').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
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
    const people = document.getElementById('numberOfPeople').value;
    const checkInStr = document.getElementById('checkInDate').value;
    const checkOutStr = document.getElementById('checkOutDate').value;
    const nights = calculateNights(checkInStr, checkOutStr);

    // DYNAMIC PRICE LOOKUP
    const detail = roomTypeDetails.find(d => d.name === type);
    const rate = detail ? detail.basePrice : 0;

    selectedRoomsCart.push({
        type: type,
        people: parseInt(people),
        price: rate * nights
    });

    renderCart();
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
    publicMessageBox.classList.remove('hidden');

    publicMessageBoxContent.textContent = message;

    publicMessageBox.classList.remove('error-message', 'success-message');
    publicMessageBox.classList.add(isError ? 'error-message' : 'success-message');
}



async function populateRoomTypeDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/public/room-types`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        // Save the full objects (which now include name, basePrice, and imageUrl)
        roomTypeDetails = await response.json(); 

        const roomTypeSelect = document.getElementById('roomTypeSelect');
        roomTypeSelect.innerHTML = '<option value="Any">Any Type</option>';
        
        roomTypeDetails.forEach(typeObj => {
            const option = document.createElement('option');
            // Assuming backend returns { name: "Deluxe", basePrice: 150000, ... }
            option.value = typeObj.name; 
            option.textContent = typeObj.name;
            roomTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching room types:', error);
    }
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const cartSection = document.getElementById('selectedRoomsCart');
    cartList.innerHTML = '';
    
    let total = 0;
    selectedRoomsCart.forEach((item, index) => {
        total += item.price;
       cartList.innerHTML += `
<li class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg mb-2 shadow-sm animate-in fade-in slide-in-from-bottom-2">
    <div class="flex flex-col">
        <span class="font-semibold text-slate-800">${item.type}</span>
        <div class="flex items-center gap-2 mt-1">
            <span class="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                ${item.people} ${item.people > 1 ? 'Guests' : 'Guest'}
            </span>
            <span class="text-xs text-slate-400">|</span>
            <span class="text-sm font-medium text-indigo-600">UGX ${item.price}</span>
        </div>
    </div>
    
    <button onclick="removeFromCart(${index})" 
            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all group"
            title="Remove room">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </button>
</li>`;
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

    /*showPublicMessageBox('Booking...', 'Confirming your booking and sending confirmation. Please wait...');?*/
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
