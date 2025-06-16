const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login'; // adjust to your actual endpoint
const ROOMS_API_URL = 'https://bookingenginebackend.onrender.com/api/rooms'; // Or your local backend URL: 'http://localhost:5000/api/rooms'

// --- Utility Functions ---
// --- Existing Constants ---


// --- NEW Constants for Room Management ---
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
/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success' or 'error').
 * @param {string} targetId - The ID of the element where the message should be displayed.
 */
/*function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');
    setTimeout(() => {
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';
    }, 5000);
}*/
/*function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = type; // Overwrites existing classes
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
            messageDiv.textContent = '';
        }, 5000);
    } else {
        console.error(`Target element with id "${targetId}" not found.`);
    }
}*/
 function showMessage(message, type, targetId) {
        const messageDiv = document.getElementById(targetId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = type; // Overwrites existing classes
            messageDiv.classList.remove('hidden');
            setTimeout(() => {
                messageDiv.classList.add('hidden');
                messageDiv.textContent = '';
            }, 5000);
        } else {
            console.error(`Target element with id "${targetId}" not found.`);
        }
    }
document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    fetchBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('input', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    fetchBookings(searchTerm);
});
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

/**
 * Fetches data from the API and handles errors.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Optional fetch options.
 * @returns {Promise<object>} - The JSON response from the API.
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// --- Booking Management ---

/**
 * Fetches all bookings from the API and displays them in a table.
 */
async function fetchBookings(searchTerm = '') {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    console.log('bookingsTableBody:', bookingsTableBody);
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const bookings = await fetchData(`${API_BASE_URL}/admin${query}`);
        bookingsData = bookings || [];
        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }

        const maxRows = 4;
        const limitedBookings = bookings.slice(0, maxRows);
        console.log('limitedBookings:', limitedBookings);
        bookingsTableBody.innerHTML = '';
       limitedBookings.forEach(booking => {
    const row = document.createElement('tr');
    let buttonHTML = `
        <button class="custom-edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" data-id="${booking._id}">Edit</button>
        <button class="custom-delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${booking._id}">Delete</button>
    `;
    row.innerHTML = `
        <td>${booking._id}</td>
        <td>${booking.service}</td>
        <td>${new Date(booking.date).toLocaleDateString()}</td>
        <td>${booking.time}</td>
        <td>${booking.name}</td>
        <td>${booking.email}</td>
        <td>${buttonHTML}</td>
    `;
    console.log('row.innerHTML before append:', row.innerHTML);
    bookingsTableBody.appendChild(row);

        });

        attachEventListenersToButtons();
        renderTablePage(currentPage);
        renderPagination();

    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

/* * Handles editing a booking.
 * @param {string} id - The ID of the booking to edit.
 */
/*async function renBookings(searchTerm = '') {
    let url = `${API_BASE_URL}/admin`;
    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    bookingsTable.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading bookings...</td></tr>';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const bookings = await response.json();
        allBookings = bookings; // Store fetched bookings
        renderBookingsTable(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsTable.querySelector('tbody').innerHTML = `<tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Failed to load bookings. Please check your network and backend. Error: ${error.message}</td></tr>`;
    }
}*/

// Event listener for the search input
/*searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
     if (searchTerm === "") {
        renderBookingsTable(allBookings);
     }else{
        fetchBookings(searchTerm);
     }
    
});

// Initial load of bookings
renBookings();*/

async function editBooking(id) {
    const editForm = document.getElementById('edit-form');
    const editIdInput = document.getElementById('edit-id');

    try {
        const booking = await fetchData(`${API_BASE_URL}/${id}`);

        editIdInput.value = booking._id;
        document.getElementById('edit-service').value = booking.service;
        document.getElementById('edit-date').value = new Date(booking.date).toISOString().split('T')[0];
        document.getElementById('edit-time').value = booking.time;
        document.getElementById('edit-name').value = booking.name;
        document.getElementById('edit-email').value = booking.email;

        document.getElementById('edit-booking-form').classList.remove('hidden');
        editForm.removeEventListener('submit', handleEditSubmit);
        editForm.addEventListener('submit', handleEditSubmit);

    } catch (error) {
        showMessage('Failed to fetch booking details for editing.', 'error', 'edit-message');
    }
}

/**
 * Handles the submission of the edit booking form.
 * @param {Event} event - The form submit event.
 */
async function handleEditSubmit(event) {
    event.preventDefault();

    const editId = document.getElementById('edit-id').value;
    const updatedBookingData = {
        service: document.getElementById('edit-service').value,
        date: document.getElementById('edit-date').value,
        time: document.getElementById('edit-time').value,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookingData),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Booking updated successfully!', 'success', 'edit-message');
            document.getElementById('edit-booking-form').classList.add('hidden');
            fetchBookings();
        } else {
            showMessage(data.message || 'Failed to update booking.', 'error', 'edit-message');
        }
    } catch (error) {
        showMessage('Error updating booking. Please check your network.', 'error', 'edit-message');
    }
}

/**
 * Handles deleting a booking.
 * @param {string} id - The ID of the booking to delete.
 */
let deleteId = null;

function showDeleteModal(id) {
  deleteId = id;
  document.getElementById('delete-modal').classList.remove('hidden');
}

document.getElementById('cancel-delete-btn').addEventListener('click', () => {
  deleteId = null;
  document.getElementById('delete-modal').classList.add('hidden');
});

document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
  if (!deleteId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${deleteId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Booking deleted successfully!', 'success', 'edit-message');
        fetchBookings();
    } else {
      showMessage(data.message || 'Failed to delete booking.', 'error', 'edit-message');
    }
  } catch (error) {
    showMessage('Error deleting booking. Please check your network.', 'error', 'edit-message');
  } finally {
    deleteId = null;
    document.getElementById('delete-modal').classList.add('hidden');
  }
});
function deleteBooking(id) {
  showDeleteModal(id);
}

/**async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Booking deleted successfully!', 'success', 'edit-message');
                fetchBookings();
            } else {
                showMessage(data.message || 'Failed to delete booking.', 'error', 'edit-message');
            }
        } catch (error) {
            showMessage('Error deleting booking. Please check your network.', 'error', 'edit-message');
        }
    }
}*/

/**
 * Handles the submission of the create booking form.
 */
async function createBookingManual() {
    const createService = document.getElementById('create-service').value;
    const createDate = document.getElementById('create-date').value;
    const createTime = document.getElementById('create-time').value;
    const createName = document.getElementById('create-name').value;
    const createEmail = document.getElementById('create-email').value;

    if (!createService || !createDate || !createTime || !createName || !createEmail) {
        showMessage('Please fill in all fields.', 'error', 'create-message');
        return;
    }

    const newBookingData = {
        service: createService,
        date: createDate,
        time: createTime,
        name: createName,
        email: createEmail,
    };

    // Show the spinner
    document.getElementById('booking-spinner').classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBookingData),
        });

        const data = await response.json();

        // Hide spinner
        document.getElementById('booking-spinner').classList.add('hidden');

        // Show result modal
        const message = response.ok
            ? 'Booking created successfully!'
            : data.message || 'Failed to create booking.';
        const resultModal = document.getElementById('booking-result-modal');
        const resultMessage = document.getElementById('booking-result-message');
        resultMessage.textContent = message;
        resultModal.classList.remove('hidden');

        if (response.ok) {
            document.getElementById('create-form').reset();
            fetchBookings();
        }

    } catch (error) {
        document.getElementById('booking-spinner').classList.add('hidden');
        const resultModal = document.getElementById('booking-result-modal');
        const resultMessage = document.getElementById('booking-result-message');
        resultMessage.textContent = 'Error creating booking. Please check your network.';
        resultModal.classList.remove('hidden');
    }
}
document.getElementById('close-result-modal').addEventListener('click', () => {
    document.getElementById('booking-result-modal').classList.add('hidden');
});


/**
 * Attaches event listeners to edit and delete buttons.
 */
function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            editBooking(bookingId);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            deleteBooking(bookingId);
        });
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();

    const createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newBooking = {
            service: document.getElementById('create-service').value,
            date: document.getElementById('create-date').value,
            time: document.getElementById('create-time').value,
            name: document.getElementById('create-name').value,
            email: document.getElementById('create-email').value,
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBooking)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Booking created successfully!', 'success', 'create-message');
                createForm.reset();
                fetchBookings();
            } else {
                showMessage(data.message || 'Failed to create booking.', 'error', 'create-message');
            }
        } catch (error) {
            showMessage('Error creating booking. Please check your network.', 'error', 'create-message');
        }
    });
});
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
      // Hide login, show dashboard
      document.getElementById('login-form').classList.add('hidden');
      document.getElementById('dashboard-content').classList.remove('hidden');
      fetchBookings(); // load bookings
    } else {
      showMessage(data.message || 'Login failed.', 'error', 'login-message');
    }
  } catch (err) {
    showMessage('Network error during login.', 'error', 'login-message');
  }
});

// --- Logout Function ---
function handleLogout() {
    // Optionally clear any session data
    // sessionStorage.clear(); // If you're using sessionStorage
    // localStorage.clear();   // If you're using localStorage

    // Hide dashboard and show login form
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');

    showMessage('You have been logged out.', 'success', 'create-message'); // Or another target ID
}

// --- Add Event Listener to Logout Button ---
document.getElementById('logout-btn').addEventListener('click', handleLogout);

document.getElementById('dashboard-tab').addEventListener('click', function () {
  document.getElementById('dashboard-section').style.display = 'block';
  document.getElementById('bookings-section').style.display = 'none';
});

document.getElementById('bookings-tab').addEventListener('click', function () {
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('bookings-section').style.display = 'block';
});

document.getElementById('search-input').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const tableRows = document.querySelectorAll('#bookings-table tbody tr');

    tableRows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? '' : 'none';
    });
});

/**let bookingData = []; // store all bookings
let currentPag = 1;
const rowsPerPag = 4;
function renderPage() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const startIndex = (currentPag - 1) * rowsPerPag;
    const endIndex = Math.min(startIndex + rowsPerPag, bookingData.length);
    const currentBookings = bookingData.slice(startIndex, endIndex);

    currentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking._id}</td>
            <td>${booking.service}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>${booking.time}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>
                <button class="edit-button" data-id="${booking._id}">Edit</button>
                <button class="delete-button" data-id="${booking._id}">Delete</button>
            </td>
        `;
        bookingsTableBody.appendChild(row);
    });

    attachEventListenersToButtons();
    updatePaginationControls();
}
/*

/**function updatePaginationControls() {
    const totalPages = Math.ceil(bookingData.length / rowsPerPag);
    document.getElementById('prev-page').disabled = currentPag === 1;
    document.getElementById('next-page').disabled = currentPag === totalPages || totalPages === 0;
    document.getElementById('page-info').textContent = `Page ${currentPag} of ${totalPages}`;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPag > 1) {
        currentPag--;
        renderPage();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(bookingData.length / rowsPerPag);
    if (currentPag < totalPages) {
        currentPag++;
        renderPage();
    }
});*/
