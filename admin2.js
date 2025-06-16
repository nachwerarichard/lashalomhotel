// --- Constants (Ensure these are at the top of your admin.js file) ---
const ROOMS_API_URL = 'https://bookingenginebackend.onrender.com/api/rooms'; // Or your local backend URL: 'http://localhost:5000/api/rooms'
// --- END Constants ---


// --- Element References for Room Management (Ensure these are at the top of your admin.js file) ---
const roomsSection = document.getElementById('rooms-section'); // Crucial: The main section that contains room UI

const roomModal = document.getElementById('room-modal');
const roomForm = document.getElementById('room-form');
const roomIdInput = document.getElementById('room-id');
const roomModalTitle = document.getElementById('room-modal-title');
const roomMessageDiv = document.getElementById('room-message'); // For messages within the room modal

const deleteRoomModal = document.getElementById('delete-room-modal');
let deleteRoomId = null; // To store the ID of the room to be deleted
// --- END Element References ---


// --- Utility Functions (Ensure these are present as well) ---
// You provided these, just confirming they are there and correctly implemented.
function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `${type} text-center`;
        if (type === 'success') {
            messageDiv.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            messageDiv.classList.add('bg-red-100', 'text-red-800');
        }
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
            messageDiv.textContent = '';
            messageDiv.className = '';
        }, 5000);
    } else {
        console.error(`Target element with id "${targetId}" not found.`);
    }
}

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
// --- END Utility Functions ---


// --- ROOM MANAGEMENT CORE FUNCTIONS (This is what you need) ---

/**
 * Fetches all rooms from the API and displays them in a table.
 * Assumes #rooms-table tbody exists in your HTML.
 */
async function fetchRooms() {
    const roomsTableBody = document.querySelector('#rooms-table tbody');
    if (!roomsTableBody) {
        console.error("Rooms table body (#rooms-table tbody) not found. Cannot display rooms.");
        return; // Exit if the element is missing
    }
    roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading rooms...</td></tr>';
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        if (!rooms || rooms.length === 0) {
            roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No rooms found. Click "Add New Room" to create one.</td></tr>';
            return;
        }

        roomsTableBody.innerHTML = ''; // Clear loading message
        rooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.roomNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.roomType}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.capacity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">UGX ${room.pricePerNight.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="${room.status === 'Available' ? 'bg-green-100 text-green-800' :
                                  room.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'} inline-flex px-2 text-xs leading-5 font-semibold rounded-full">
                        ${room.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.features.length > 0 ? room.features.join(', ') : 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm edit-room-btn" data-id="${room._id}">Edit</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm delete-room-btn" data-id="${room._id}">Delete</button>
                </td>
            `;
            roomsTableBody.appendChild(row);
        });
        attachRoomEventListeners(); // Attach listeners after rows are added
    } catch (error) {
        console.error("Error in fetchRooms:", error);
        roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Failed to load rooms. Please check your network and backend.</td></tr>';
    }
}

/** Attaches event listeners to Edit and Delete buttons for rooms. */
function attachRoomEventListeners() {
    document.querySelectorAll('.edit-room-btn').forEach(button => {
        button.addEventListener('click', () => {
            const roomId = button.getAttribute('data-id');
            editRoom(roomId);
        });
    });
    document.querySelectorAll('.delete-room-btn').forEach(button => {
        button.addEventListener('click', () => {
            const roomId = button.getAttribute('data-id');
            showDeleteRoomModal(roomId);
        });
    });
}

/**
 * Populates the room modal for editing a specific room.
 * @param {string} id - The ID of the room to edit.
 */
async function editRoom(id) {
    try {
        const room = await fetchData(`${ROOMS_API_URL}/${id}`);
        roomIdInput.value = room._id;
        document.getElementById('room-number').value = room.roomNumber;
        document.getElementById('room-type').value = room.roomType;
        document.getElementById('room-capacity').value = room.capacity;
        document.getElementById('room-price').value = room.pricePerNight;
        document.getElementById('room-status').value = room.status;
        document.getElementById('room-features').value = room.features.join(', ');
        document.getElementById('room-notes').value = room.notes || '';

        roomModalTitle.textContent = 'Edit Room';
        roomMessageDiv.classList.add('hidden'); // Hide previous messages
        roomModal.classList.remove('hidden'); // Show the modal
    } catch (error) {
        console.error('Error fetching room details for editing:', error);
        showMessage('Failed to fetch room details for editing.', 'error', 'room-message');
    }
}

/** Handles the submission of the Add/Edit Room form. */
roomForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = roomIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${ROOMS_API_URL}/${id}` : ROOMS_API_URL;

    const roomData = {
        roomNumber: document.getElementById('room-number').value.trim(),
        roomType: document.getElementById('room-type').value,
        capacity: parseInt(document.getElementById('room-capacity').value),
        pricePerNight: parseFloat(document.getElementById('room-price').value),
        status: document.getElementById('room-status').value,
        features: document.getElementById('room-features').value.split(',').map(f => f.trim()).filter(f => f),
        notes: document.getElementById('room-notes').value.trim()
    };

    if (!roomData.roomNumber || !roomData.roomType || isNaN(roomData.capacity) || isNaN(roomData.pricePerNight)) {
        showMessage('Please fill in all required fields (Room Number, Type, Capacity, Price).', 'error', 'room-message');
        return;
    }
    if (roomData.capacity < 1) {
        showMessage('Capacity must be at least 1.', 'error', 'room-message');
        return;
    }
    if (roomData.pricePerNight < 0) {
        showMessage('Price per night cannot be negative.', 'error', 'room-message');
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomData),
        });
        const data = await response.json();

        if (response.ok) {
            showMessage(id ? 'Room updated successfully!' : 'Room created successfully!', 'success', 'room-message');
            roomModal.classList.add('hidden');
            fetchRooms(); // Refresh the room list
            // If you have a dashboard summary, update it:
            // fetchDashboardSummary();
        } else {
            showMessage(data.message || 'Failed to save room.', 'error', 'room-message');
        }
    } catch (error) {
        console.error('Error saving room:', error);
        showMessage('Error saving room. Please check your network or server status.', 'error', 'room-message');
    }
});

// Event listeners for the Add/Edit Room Modal buttons
document.getElementById('add-room-btn').addEventListener('click', () => {
    roomForm.reset();
    roomIdInput.value = '';
    roomModalTitle.textContent = 'Add New Room';
    roomMessageDiv.classList.add('hidden');
    roomMessageDiv.textContent = '';
    roomModal.classList.remove('hidden');
});

document.getElementById('cancel-room-btn').addEventListener('click', () => {
    roomModal.classList.add('hidden');
});

/** Shows the delete confirmation modal for a room. */
function showDeleteRoomModal(id) {
    deleteRoomId = id;
    document.getElementById('delete-room-message').classList.add('hidden');
    document.getElementById('delete-room-message').textContent = '';
    deleteRoomModal.classList.remove('hidden');
}

// Event listeners for the Delete Room Modal buttons
document.getElementById('cancel-delete-room-btn').addEventListener('click', () => {
    deleteRoomId = null;
    deleteRoomModal.classList.add('hidden');
});

document.getElementById('confirm-delete-room-btn').addEventListener('click', async () => {
    if (!deleteRoomId) return;

    try {
        const response = await fetch(`${ROOMS_API_URL}/${deleteRoomId}`, { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
            showMessage('Room deleted successfully!', 'success', 'delete-room-message');
            deleteRoomModal.classList.add('hidden');
            fetchRooms();
            // If you have a dashboard summary, update it:
            // fetchDashboardSummary();
        } else {
            showMessage(data.message || 'Failed to delete room.', 'error', 'delete-room-message');
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        showMessage('Error deleting room. Please check your network or server status.', 'error', 'delete-room-message');
    } finally {
        deleteRoomId = null;
    }
});
// --- END ROOM MANAGEMENT CORE FUNCTIONS ---


// --- Specific event listener for the Desktop Rooms Tab ---
document.addEventListener('DOMContentLoaded', () => {
    const roomsTab = document.getElementById('rooms-tab'); // Get the specific rooms tab element

    // Ensure the rooms section is correctly hidden/shown by your overall navigation logic
    // This part assumes your general navigation system handles showing/hiding sections.
    // The key here is to call fetchRooms() when the rooms section *becomes* visible.

    // If your `menu-item` click handler (from the previous response) is still active
    // and correctly toggles `display: block/none` based on `data-target`,
    // then this single listener on `roomsTab` might be redundant *unless*
    // you want to specifically trigger `fetchRooms` ONLY when this desktop tab is clicked.

    // Given your `menu-item` approach, the most robust way is to keep the generalized handler:
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const targetSectionId = this.getAttribute('data-target');
            if (targetSectionId && document.getElementById(targetSectionId)) {
                // Assuming hideAllSections() and display:block logic is handled elsewhere
                // Or you can put it here if this is the ONLY place sections are switched
                // Example:
                // document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
                // document.getElementById(targetSectionId).style.display = 'block';

                if (targetSectionId === 'rooms-section') {
                    fetchRooms(); // Only fetch rooms when rooms section is activated
                }
                // Add other section-specific fetches here for other tabs if needed
                // e.g., if (targetSectionId === 'bookings-section') { fetchBookings(); }
            }
        });
    });

    // You might also want to call fetchRooms initially if the rooms tab is the default visible section
    // or if the user is already on the rooms page (e.g., after a refresh if state is managed)
    // if (roomsSection && !roomsSection.classList.contains('hidden')) {
    //     fetchRooms();
    // }
});

// IMPORTANT: Review your admin login success block.
// It should probably show 'dashboard-section' by default and call fetchDashboardSummary().
// Calls to fetchRooms() and fetchBookings() should occur when those respective tabs are clicked,
// or if you want to preload data on login, they can be called there too.
// The code from the previous response for the admin login block handles this well.
