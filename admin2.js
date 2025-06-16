// --- NEW Constants for Room Management ---
const ROOMS_API_URL = 'https://bookingenginebackend.onrender.com/api/rooms'; // Or your local backend URL: 'http://localhost:5000/api/rooms'
// --- END NEW Constants ---

// --- Utility Functions (keep existing showMessage, fetchData) ---
function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `${type} text-center`; // Added text-center for better look
        if (type === 'success') {
            messageDiv.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            messageDiv.classList.add('bg-red-100', 'text-red-800');
        }
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
            messageDiv.textContent = '';
            messageDiv.className = ''; // Clear classes
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


// --- EXISTING Booking Management (no changes needed here initially) ---
// ... your fetchBookings, editBooking, handleEditSubmit, deleteBooking, showDeleteModal, createBookingManual ...
// Make sure attachEventListenersToButtons is called after fetchBookings
// ...
// document.getElementById('search-btn').addEventListener('click', () => { ... });
// document.getElementById('search-input').addEventListener('input', () => { ... });
// document.getElementById('search-input').addEventListener('keypress', (e) => { ... });
// document.getElementById('confirm-delete-btn').addEventListener('click', async () => { ... });
// document.getElementById('cancel-delete-btn').addEventListener('click', () => { ... });
// document.getElementById('close-result-modal').addEventListener('click', () => { ... });
// ...
// --- END EXISTING Booking Management ---


// --- NEW Room Management Functions ---

const roomModal = document.getElementById('room-modal');
const roomForm = document.getElementById('room-form');
const roomIdInput = document.getElementById('room-id');
const roomModalTitle = document.getElementById('room-modal-title');
const roomMessageDiv = document.getElementById('room-message');

const deleteRoomModal = document.getElementById('delete-room-modal');
let deleteRoomId = null;

/**
 * Fetches all rooms from the API and displays them in a table.
 */
async function fetchRooms() {
    const roomsTableBody = document.querySelector('#rooms-table tbody');
    roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading rooms...</td></tr>';
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        if (!rooms || rooms.length === 0) {
            roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No rooms found.</td></tr>';
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.status}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.features.length > 0 ? room.features.join(', ') : 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm edit-room-btn" data-id="${room._id}">Edit</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm delete-room-btn" data-id="${room._id}">Delete</button>
                </td>
            `;
            roomsTableBody.appendChild(row);
        });
        attachRoomEventListeners();
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
        document.getElementById('room-notes').value = room.notes || ''; // Handle potential undefined notes

        roomModalTitle.textContent = 'Edit Room';
        roomMessageDiv.classList.add('hidden'); // Hide previous messages
        roomModal.classList.remove('hidden'); // Show the modal
    } catch (error) {
        showMessage('Failed to fetch room details for editing.', 'error', 'room-message');
    }
}

/** Handles the submission of the Add/Edit Room form. */
roomForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const id = roomIdInput.value;
    const method = id ? 'PUT' : 'POST'; // Determine if it's an update or create
    const url = id ? `${ROOMS_API_URL}/${id}` : ROOMS_API_URL;

    const roomData = {
        roomNumber: document.getElementById('room-number').value.trim(),
        roomType: document.getElementById('room-type').value,
        capacity: parseInt(document.getElementById('room-capacity').value),
        pricePerNight: parseFloat(document.getElementById('room-price').value),
        status: document.getElementById('room-status').value,
        features: document.getElementById('room-features').value.split(',').map(f => f.trim()).filter(f => f), // Split by comma, trim, and filter empty strings
        notes: document.getElementById('room-notes').value.trim()
    };

    // Basic client-side validation
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
        const data = await response.json(); // Always parse JSON, even on errors

        if (response.ok) {
            showMessage(id ? 'Room updated successfully!' : 'Room created successfully!', 'success', 'room-message');
            roomModal.classList.add('hidden'); // Hide modal on success
            fetchRooms(); // Refresh the room list
            fetchDashboardSummary(); // Update dashboard counts
        } else {
            // Backend errors (e.g., duplicate room number, validation errors)
            showMessage(data.message || 'Failed to save room.', 'error', 'room-message');
        }
    } catch (error) {
        // Network errors or other unexpected errors
        console.error('Error saving room:', error);
        showMessage('Error saving room. Please check your network or server status.', 'error', 'room-message');
    }
});

// Event listeners for the Add/Edit Room Modal buttons
document.getElementById('add-room-btn').addEventListener('click', () => {
    roomForm.reset(); // Clear the form
    roomIdInput.value = ''; // Clear ID for new room
    roomModalTitle.textContent = 'Add New Room'; // Set modal title
    roomMessageDiv.classList.add('hidden'); // Hide previous messages
    roomMessageDiv.textContent = ''; // Clear message text
    roomModal.classList.remove('hidden'); // Show modal
});

document.getElementById('cancel-room-btn').addEventListener('click', () => {
    roomModal.classList.add('hidden'); // Hide modal
});


/** Shows the delete confirmation modal for a room. */
function showDeleteRoomModal(id) {
    deleteRoomId = id;
    document.getElementById('delete-room-message').classList.add('hidden'); // Hide previous messages
    document.getElementById('delete-room-message').textContent = ''; // Clear message text
    deleteRoomModal.classList.remove('hidden');
}

// Event listeners for the Delete Room Modal buttons
document.getElementById('cancel-delete-room-btn').addEventListener('click', () => {
    deleteRoomId = null;
    deleteRoomModal.classList.add('hidden');
});

document.getElementById('confirm-delete-room-btn').addEventListener('click', async () => {
    if (!deleteRoomId) return; // Should not happen if modal is correctly triggered

    try {
        const response = await fetch(`${ROOMS_API_URL}/${deleteRoomId}`, { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
            showMessage('Room deleted successfully!', 'success', 'delete-room-message'); // Show message in delete modal context
            deleteRoomModal.classList.add('hidden');
            fetchRooms(); // Refresh the room list
            fetchDashboardSummary(); // Update dashboard counts
        } else {
            showMessage(data.message || 'Failed to delete room.', 'error', 'delete-room-message');
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        showMessage('Error deleting room. Please check your network or server status.', 'error', 'delete-room-message');
    } finally {
        deleteRoomId = null; // Clear the ID regardless of success/failure
    }
});

// --- END NEW Room Management Functions ---


// --- NEW Dashboard Summary Function ---
// This function will fetch counts for rooms and eventually inventory/sales
async function fetchDashboardSummary() {
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room.status === 'Available').length;

        document.getElementById('total-rooms').textContent = totalRooms;
        document.getElementById('available-rooms').textContent = availableRooms;

        // Add placeholders for Inventory and POS later
        // document.getElementById('total-inventory-items').textContent = '0';
        // document.getElementById('total-sales-today').textContent = 'UGX 0.00';

    } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
        // showMessage('Failed to load dashboard summary.', 'error', 'dashboard-message'); // If you add a message div to dashboard
    }
}
// --- END NEW Dashboard Summary Function ---


// --- Existing Admin Login (ensure this calls fetchRooms and fetchDashboardSummary after successful login) ---
document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
            fetchBookings();        // Load bookings
            fetchRooms();           // NEW: Load rooms
            fetchDashboardSummary(); // NEW: Load dashboard summary
            // You might want to automatically switch to the dashboard tab on login
            // document.getElementById('dashboard-section').style.display = 'block';
            // document.getElementById('bookings-section').style.display = 'none';
            // document.getElementById('rooms-section').style.display = 'none';
        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch (err) {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});
// --- END Existing Admin Login ---


// --- EXISTING Logout Function (no changes) ---
// ... handleLogout ...
// ... document.getElementById('logout-btn').addEventListener('click', handleLogout); ...
// --- END EXISTING Logout Function ---


// --- EXISTING Tab Navigation (UPDATE THIS SECTION) ---
document.getElementById('dashboard-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('bookings-section').style.display = 'none';
    document.getElementById('rooms-section').style.display = 'none'; // NEW
    // Add other sections here as you build them (inventory, pos)
    fetchDashboardSummary(); // Refresh dashboard on tab click
});

document.getElementById('bookings-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'block';
    document.getElementById('rooms-section').style.display = 'none'; // NEW
    // Add other sections here
    fetchBookings();
});

// NEW Tab Listener for Rooms
document.getElementById('rooms-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'none';
    document.getElementById('rooms-section').style.display = 'block'; // Show rooms section
    // Hide other sections
    fetchRooms(); // Load rooms when tab is clicked
});
// --- END EXISTING Tab Navigation ---


// --- EXISTING Document Load Listener (ensure initial calls) ---
document.addEventListener('DOMContentLoaded', () => {
    // These functions should primarily be called *after* a successful admin login
    // The initial fetchBookings() from your previous code might be removed here
    // as it's now called upon successful login.
    // However, if you want guests to see bookings without login, keep it.

    // If you always want to load bookings on page load (even if not logged in):
    // fetchBookings();

    // The admin login listener is already outside here and calls these.
    // If you remove the 'hidden' class from dashboard-content by default (for testing),
    // then uncomment these for initial load:
    // fetchBookings();
    // fetchRooms();
    // fetchDashboardSummary();
});
// --- END Existing Document Load Listener ---

// --- IMPORTANT: Refactor the showMessage function to include Tailwind classes (as updated above) ---
// And make sure you're consistent with the `targetId` for messages
// (e.g., 'edit-message' for booking edit, 'room-message' for room, 'delete-room-message' for room delete confirmation)
