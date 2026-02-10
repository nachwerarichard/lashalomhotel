// --- UPDATED: Dynamic Booking Engine Logic ---
let availableRoomsBySelectedType = {};
let selectedRoomsCart = []; 
let roomTypeDetails = {}; // Stores prices and images from API

// 1. Initialize: Fetch actual names, prices, and images from the backend
async function init() {
    try {
        const res = await fetch(`${API_BASE_URL}/public/room-types`);
        const types = await res.json();
        
        const select = document.getElementById('roomTypeSelect');
        select.innerHTML = '<option value="Any">Any Type</option>';

        types.forEach(t => {
            // Store details in a map for easy lookup later
            // Expected backend format: { name: "Deluxe", basePrice: 120000, imageUrl: "..." }
            roomTypeDetails[t.name] = {
                price: t.basePrice,
                image: t.imageUrl || "multimedia/pics/default.jpg" 
            };

            const opt = document.createElement('option');
            opt.value = t.name; 
            opt.textContent = t.name;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// 2. Modified Availability Logic
checkAvailabilityBtn.addEventListener('click', async () => {
    // ... (Your existing date validation) ...

    try {
        const response = await fetch(`${API_BASE_URL}/public/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${roomType}&people=${people}`);
        availableRoomsBySelectedType = await response.json();

        container.innerHTML = '';
        const keys = Object.keys(availableRoomsBySelectedType);

        if (keys.length > 0) {
            availabilityResultsSection.style.display = 'block';

            keys.forEach(type => {
                const data = availableRoomsBySelectedType[type]; // data has {count, rooms, price}
                
                // Get image and price dynamically from our initialized details or the API response
                const imageUrl = roomTypeDetails[type]?.image || "multimedia/pics/default.jpg";
                const displayPrice = data.price || roomTypeDetails[type]?.price;

                if (data.count > 0) {
                    const card = document.createElement('div');
                    card.className = 'min-w-[280px] sm:min-w-[320px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 snap-start flex-shrink-0 group';
                    
                    card.innerHTML = `
                        <div class="relative overflow-hidden">
                            <img src="${imageUrl}" class="w-full h-48 object-cover" alt="${type}">
                            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md">
                                <p class="text-[10px] font-bold uppercase">${data.count} Available</p>
                            </div>
                        </div>
                        <div class="p-5">
                            <h4 class="text-lg font-semibold text-slate-900">${type}</h4>
                            <p class="text-indigo-600 font-bold mb-3">UGX ${displayPrice.toLocaleString()}</p>
                            <button class="book-now-btn w-full bg-slate-900 text-white py-2.5 rounded-lg" 
                                    data-type="${type}" 
                                    data-price="${displayPrice}">
                                Select Room
                            </button>
                        </div>
                    `;
                    container.appendChild(card);
                }
            });

            // Re-attach event listeners
            document.querySelectorAll('.book-now-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    handleBookNow(e.target.dataset.type, parseFloat(e.target.dataset.price));
                });
            });
        }
    } catch (error) { /* error handling */ }
});

// 3. Updated "Handle Book Now" (No more hardcoded priceList)
function handleBookNow(type, ratePerNight) {
    const people = document.getElementById('numberOfPeople').value;
    const checkInStr = document.getElementById('checkInDate').value;
    const checkOutStr = document.getElementById('checkOutDate').value;
    const nights = calculateNights(checkInStr, checkOutStr);

    if (nights <= 0) return alert("Invalid dates");

    // Add to cart using the price passed from the button
    selectedRoomsCart.push({
        type: type,
        people: parseInt(people),
        price: ratePerNight * nights,
        ratePerNight: ratePerNight
    });

    renderCart();
}
