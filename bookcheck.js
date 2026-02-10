const API_BASE_URL = 'https://patrinahhotelpms.onrender.com/api';

// State Management
let availableRoomsBySelectedType = {};
let selectedRoomsCart = [];
let allRoomTypesData = []; // Store full objects from backend

// --- Initialization ---
async function init() {
    try {
        const res = await fetch(`${API_BASE_URL}/public/room-types`);
        allRoomTypesData = await res.json(); // Now contains [{name, basePrice, imageUrl}]
        
        const select = document.getElementById('roomTypeSelect');
        select.innerHTML = '<option value="Any">Any Type</option>';
        
        allRoomTypesData.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.name; 
            opt.textContent = t.name;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Init Error:', error);
    }
}
init();

// --- Availability Logic ---
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
            document.getElementById('noAvailabilityMessage').style.display = 'none';

            keys.forEach(type => {
                const data = availableRoomsBySelectedType[type];
                
                // Find image and price from our pre-loaded room types data
                const typeInfo = allRoomTypesData.find(t => t.name === type) || {};
                const imageUrl = typeInfo.imageUrl || "multimedia/pics/placeholder.jpg";
                const displayPrice = typeInfo.basePrice || 0;

                if (data.count > 0) {
                    const card = document.createElement('div');
                    card.className = 'min-w-[280px] sm:min-w-[320px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 snap-start flex-shrink-0 group';
                    
                    card.innerHTML = `
                        <div class="relative overflow-hidden">
                            <img src="${imageUrl}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" alt="${type}">
                            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-700">${data.count} Available</p>
                            </div>
                        </div>
                        <div class="p-5">
                            <h4 class="text-lg font-semibold text-slate-900 mb-1">${type}</h4>
                            <p class="text-indigo-600 font-bold text-sm mb-4">UGX ${displayPrice.toLocaleString()} / Night</p>
                            <button class="book-now-btn w-full bg-slate-900 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm" 
                                    onclick="handleBookNow('${type}')">
                                Select Room
                            </button>
                        </div>
                    `;
                    container.appendChild(card);
                }
            });
        } else {
            document.getElementById('noAvailabilityMessage').style.display = 'block';
            availabilityResultsSection.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
    }
});

// --- Cart & Booking Logic ---
function handleBookNow(type) {
    const checkInStr = document.getElementById('checkInDate').value;
    const checkOutStr = document.getElementById('checkOutDate').value;
    const people = document.getElementById('numberOfPeople').value;
    const nights = calculateNights(checkInStr, checkOutStr);

    // Get live price from our loaded data
    const typeInfo = allRoomTypesData.find(t => t.name === type);
    const rate = typeInfo ? typeInfo.basePrice : 0;

    selectedRoomsCart.push({
        type: type,
        people: parseInt(people),
        price: rate * nights,
        ratePerNight: rate
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
        cartList.innerHTML += `
            <li class="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg mb-2 shadow-sm">
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">${item.type}</span>
                    <span class="text-xs text-indigo-600 font-medium">UGX ${item.price.toLocaleString()}</span>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            </li>`;
    });

    document.getElementById('finalTotalDue').textContent = total.toLocaleString();
    document.getElementById('bookingTotalDue').value = total;
    
    cartSection.style.display = 'block';
    document.getElementById('guestDetailsForm').style.display = 'block';
    document.getElementById('availabilityResults').style.display = 'none';
}
