const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login'; // adjust to your actual endpoint
console.log("admin.js loaded");

// --- Global Variables ---
let allBookingsData = []; // To store all fetched bookings for pagination/search
let roomList = []; // To store available rooms
let currentPage = 1;
const rowsPerPage = 4;

// --- Utility Functions ---
/**
 * Displays a message to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success' or 'error').
 * @param {string} targetId - The ID of the element where the message should be displayed.
 */
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
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// --- Room Management ---
async function loadRooms() {
    try {
        roomList = await fetchData(`${API_BASE_URL}/rooms`);
        // No need to call fetchBookings here, it's called on DOMContentLoaded
    } catch (err) {
        console.error('Room loading error:', err);
        showMessage('Failed to load rooms for assignment.', 'error', 'edit-message');
    }
}

// --- Booking Management ---

/**
 * Fetches all bookings from the API and updates the global allBookingsData.
 * Then, it triggers rendering of the table based on current page and search term.
 * @param {string} searchTerm - Optional search term to filter bookings.
 */
async function fetchBookings(searchTerm = '') {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="8">Loading bookings...</td></tr>';

    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const bookings = await fetchData(`${API_BASE_URL}/admin${query}`);
        allBookingsData = bookings || []; // Store all fetched bookings

        if (!allBookingsData || allBookingsData.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="8">No bookings found.</td></tr>';
            renderPagination(); // Still call to ensure pagination is updated (e.g., all disabled)
            return;
        }
        renderTablePage(currentPage);
        renderPagination();
    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="8">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

/**
 * Renders the bookings for the current page into the table.
 * @param {number} page - The current page number to render.
 */
function renderTablePage(page) {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, allBookingsData.length);
    const currentBookings = allBookingsData.slice(startIndex, endIndex);

    currentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${booking._id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.service}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(booking.date).toLocaleDateString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.time}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="custom-edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" data-id="${booking._id}">Edit</button>
                <button class="custom-delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${booking._id}">Delete</button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                ${roomList && roomList.length
                    ? `<button class="assign-room-btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" data-id="${booking._id}" data-date="${booking.date}">Assign Room</button>`
                    : '<span class="text-red-500">No rooms loaded</span>'
                }
            </td>
        `;
        bookingsTableBody.appendChild(row);
    });
    attachEventListenersToButtons();
}

/**
 * Renders and updates pagination controls.
 */
function renderPagination() {
    const totalPages = Math.ceil(allBookingsData.length / rowsPerPage);
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages || 1}`;
}

// --- Event Listeners for Search and Pagination ---
document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    currentPage = 1; // Reset to first page on new search
    fetchBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('input', () => {
    // Optional: live search, or only search on button click/enter
    // For live search, uncomment the line below:
    // const searchTerm = document.getElementById('search-input').value.trim();
    // currentPage = 1;
    // fetchBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTablePage(currentPage);
        renderPagination();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(allBookingsData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTablePage(currentPage);
        renderPagination();
    }
});

// --- Edit Booking Functions ---
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
        // Ensure only one submit listener is active
        editForm.removeEventListener('submit', handleEditSubmit);
        editForm.addEventListener('submit', handleEditSubmit);

    } catch (error) {
        showMessage('Failed to fetch booking details for editing.', 'error', 'edit-message');
    }
}

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
        const data = await fetchData(`${API_BASE_URL}/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookingData),
        });

        showMessage('Booking updated successfully!', 'success', 'edit-message');
        document.getElementById('edit-booking-form').classList.add('hidden');
        fetchBookings(document.getElementById('search-input').value.trim()); // Refresh with current search term
    } catch (error) {
        showMessage(error.message || 'Error updating booking. Please check your network.', 'error', 'edit-message');
    }
}

// --- Delete Booking Functions ---
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
        const data = await fetchData(`${API_BASE_URL}/${deleteId}`, {
            method: 'DELETE'
        });

        showMessage('Booking deleted successfully!', 'success', 'edit-message');
        fetchBookings(document.getElementById('search-input').value.trim()); // Refresh with current search term
    } catch (error) {
        showMessage(error.message || 'Error deleting booking. Please check your network.', 'error', 'edit-message');
    } finally {
        deleteId = null;
        document.getElementById('delete-modal').classList.add('hidden');
    }
});

function deleteBooking(id) {
    showDeleteModal(id);
}

// --- Create Booking Function ---
document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newBookingData = {
        service: document.getElementById('create-service').value,
        date: document.getElementById('create-date').value,
        time: document.getElementById('create-time').value,
        name: document.getElementById('create-name').value,
        email: document.getElementById('create-email').value,
    };

    if (!newBookingData.service || !newBookingData.date || !newBookingData.time || !newBookingData.name || !newBookingData.email) {
        showMessage('Please fill in all fields.', 'error', 'create-message');
        return;
    }

    document.getElementById('booking-spinner').classList.remove('hidden');

    try {
        const data = await fetchData(`${API_BASE_URL}/manual`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBookingData),
        });

        document.getElementById('booking-spinner').classList.add('hidden');
        showMessage('Booking created successfully!', 'success', 'booking-result-message');
        document.getElementById('create-form').reset();
        fetchBookings(document.getElementById('search-input').value.trim()); // Refresh with current search term

    } catch (error) {
        document.getElementById('booking-spinner').classList.add('hidden');
        showMessage(error.message || 'Error creating booking. Please check your network.', 'error', 'booking-result-message');
    } finally {
        document.getElementById('booking-result-modal').classList.remove('hidden');
    }
});

document.getElementById('close-result-modal').addEventListener('click', () => {
    document.getElementById('booking-result-modal').classList.add('hidden');
});

// --- Assign Room Functionality (Modal-based) ---
let currentBookingToAssignRoom = null;

document.getElementById('assign-room-modal-close').addEventListener('click', () => {
    document.getElementById('assign-room-modal').classList.add('hidden');
    currentBookingToAssignRoom = null;
});

document.getElementById('assign-room-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentBookingToAssignRoom) return;

    const selectedRoomNumber = document.getElementById('room-select').value;
    const bookingDate = document.getElementById('assign-room-booking-date').value;

    if (!selectedRoomNumber) {
        showMessage('Please select a room.', 'error', 'assign-room-message');
        return;
    }

    try {
        const data = await fetchData(`${API_BASE_URL}/assign-room/${currentBookingToAssignRoom}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomNumber: selectedRoomNumber, date: bookingDate })
        });

        showMessage('Room assigned successfully!', 'success', 'edit-message'); // Using edit-message as a general success display
        document.getElementById('assign-room-modal').classList.add('hidden');
        currentBookingToAssignRoom = null;
        fetchBookings(document.getElementById('search-input').value.trim()); // Refresh table
    } catch (err) {
        showMessage(err.message || 'Failed to assign room.', 'error', 'assign-room-message');
    }
});

/**
 * Attaches event listeners to edit, delete, and assign room buttons.
 */
function attachEventListenersToButtons() {
    document.querySelectorAll('.custom-edit-btn').forEach(button => {
        button.onclick = null; // Remove previous listeners
        button.onclick = () => {
            const bookingId = button.getAttribute('data-id');
            editBooking(bookingId);
        };
    });

    document.querySelectorAll('.custom-delete-btn').forEach(button => {
        button.onclick = null; // Remove previous listeners
        button.onclick = () => {
            const bookingId = button.getAttribute('data-id');
            deleteBooking(bookingId);
        };
    });

    document.querySelectorAll('.assign-room-btn').forEach(button => {
        button.onclick = null; // Remove previous listeners
        button.onclick = () => {
            const bookingId = button.getAttribute('data-id');
            const bookingDate = button.getAttribute('data-date');
            currentBookingToAssignRoom = bookingId;
            document.getElementById('assign-room-booking-date').value = bookingDate; // Populate hidden field for date

            const roomSelect = document.getElementById('room-select');
            roomSelect.innerHTML = '<option value="">Select a Room</option>'; // Clear previous options
            roomList.forEach(room => {
                const option = document.createElement('option');
                option.value = room.number;
                option.textContent = room.number;
                roomSelect.appendChild(option);
            });
            document.getElementById('assign-room-modal').classList.remove('hidden');
        };
    });
}

// --- Admin Login and Logout ---
document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await fetchData(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Hide login, show dashboard
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('dashboard-content').classList.remove('hidden');
        await loadRooms(); // Load rooms upon successful login
        fetchBookings(); // load bookings
    } catch (err) {
        showMessage(err.message || 'Login failed.', 'error', 'login-message');
    }
});

function handleLogout() {
    // Optionally clear any session data if you're storing tokens etc.
    // sessionStorage.clear();
    // localStorage.clear();

    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    showMessage('You have been logged out.', 'success', 'login-message'); // Use login-message for logout
}

document.getElementById('logout-btn').addEventListener('click', handleLogout);

// --- Tab Navigation ---
document.getElementById('dashboard-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('bookings-section').style.display = 'none';
});

document.getElementById('bookings-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'block';
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Only load rooms and bookings if already logged in (e.g., if session persisted)
    // Otherwise, these will be loaded after successful login.
    // For this example, we assume initial state is logged out.
    // If you have a way to check login status on page load, add it here.
});
