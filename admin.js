console.log("admin.js loaded");

// --- Global Variables ---
const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Base for bookings
// Assuming your backend mounts the bookings router at '/api/bookings'
// And your rooms endpoint will be e.g. 'https://bookingenginebackend.onrender.com/api/bookings/rooms'
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login';

let bookingsData = []; // Stores ALL fetched bookings for pagination/search
let roomList = [];    // Stores ALL fetched rooms for dropdowns
let currentPage = 1;  // Current page for pagination
const rowsPerPage = 4; // Number of rows to display per page

const bookingsTableBody = document.querySelector('#bookings-table tbody');
const paginationContainer = document.getElementById('pagination-controls'); // Ensure this element exists in your HTML!

// --- Utility Functions ---

function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.textContent = message;
        // Ensure Tailwind classes for styling (e.g., text-green-500, text-red-500, bg-green-100, bg-red-100, p-2, rounded)
        messageDiv.className = `p-2 rounded mt-2 ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
            messageDiv.textContent = '';
        }, 5000);
    } else {
        console.error(`Target element with id "${targetId}" not found.`);
    }
}

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in fetchData:", error);
        throw error;
    }
}

// --- Room Fetching ---
async function fetchRooms() {
    try {
        // *** CORRECT ROOMS API ENDPOINT ***
        // Assuming your backend's main app.js has app.use('/api/bookings', bookingsRouter);
        // and in bookingsRouter, you added router.get('/rooms', ...)
        const rooms = await fetchData(`${API_BASE_URL}/rooms`); //
        roomList = rooms || []; // Ensure roomList is an array
        console.log("Rooms fetched for dropdown:", roomList); // Confirm data here
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        roomList = []; // Ensure it's an empty array on error
    }
}

// --- Render Functions ---

// Function to render a single booking row
function renderBookingRow(booking) {
    const row = document.createElement('tr');

    const buttonHTML = `
        <button class="custom-edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" data-id="${booking._id}">Edit</button>
        <button class="custom-delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id="${booking._id}">Delete</button>
    `;

    // Logic for the assign room dropdown
    const assignRoomDropdownHTML = roomList && roomList.length //
        ? `<select class="assign-room-dropdown border p-2 rounded" data-id="${booking._id}">
              <option value="">Assign Room</option>
              ${roomList.map(r => `<option value="${r.number}" ${booking.roomNumber === r.number ? 'selected' : ''}>${r.number}</option>`).join('')}
           </select>`
        : '<span class="text-red-500">No rooms loaded</span>'; //

    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${booking._id}</td>
        <td class="px-6 py-4 whitespace-nowrap">${booking.service}</td>
        <td class="px-6 py-4 whitespace-nowrap">${new Date(booking.date).toLocaleDateString()}</td>
        <td class="px-6 py-4 whitespace-nowrap">${booking.time}</td>
        <td class="px-6 py-4 whitespace-nowrap">${booking.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${booking.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${buttonHTML}</td>
        <td class="px-6 py-4 whitespace-nowrap">${assignRoomDropdownHTML}</td>
    `;
    return row;
}

// Function to render the current page of the table
function renderTablePage(page) {
    currentPage = page;
    bookingsTableBody.innerHTML = ''; // Clear previous content

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedBookings = bookingsData.slice(start, end); // Use the global bookingsData

    if (paginatedBookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">No bookings found for this page.</td></tr>'; // 8 columns
        return;
    }

    paginatedBookings.forEach(booking => {
        const row = renderBookingRow(booking); // Use the helper function
        bookingsTableBody.appendChild(row);
    });

    // Re-attach event listeners *after* new rows are added to the DOM
    attachEventListenersToButtons();
}

// Function to render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);

    if (!paginationContainer) {
        console.warn("Pagination container not found (ID: pagination-controls). Skipping pagination rendering.");
        return;
    }

    paginationContainer.innerHTML = ''; // Clear existing pagination buttons

    // Prev button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('px-3', 'py-1', 'mx-1', 'border', 'rounded', 'bg-gray-200', 'hover:bg-gray-300');
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => renderTablePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('px-3', 'py-1', 'mx-1', 'border', 'rounded');
        if (i === currentPage) {
            button.classList.add('bg-blue-500', 'text-white');
        } else {
            button.classList.add('bg-gray-200', 'hover:bg-gray-300');
        }
        button.onclick = () => renderTablePage(i);
        paginationContainer.appendChild(button);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('px-3', 'py-1', 'mx-1', 'border', 'rounded', 'bg-gray-200', 'hover:bg-gray-300');
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.onclick = () => renderTablePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);
}

// --- Main Fetch Bookings Function ---
async function fetchBookings(searchTerm = '') {
    bookingsTableBody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">Loading bookings...</td></tr>'; // 8 columns

    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        // Note: The API_BASE_URL here is for bookings, not admin specifically.
        // Your backend /admin endpoint is inside the bookings router.
        const fetchedBookings = await fetchData(`${API_BASE_URL}/admin${query}`);
        bookingsData = fetchedBookings || []; // Store ALL fetched bookings

        if (!bookingsData || bookingsData.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-gray-500">No bookings found.</td></tr>'; // 8 columns
            if (paginationContainer) paginationContainer.innerHTML = ''; // Clear pagination
            return;
        }

        // Render the first page and pagination controls
        renderTablePage(1); // Start on page 1
        renderPagination();

    } catch (error) {
        console.error("Error fetching bookings:", error);
        bookingsTableBody.innerHTML = '<tr><td colspan="8" class="px-6 py-4 text-center text-red-500">Failed to load bookings. Please check your network and backend.</td></tr>'; // 8 columns
    }
}

// --- Event Handlers ---

function attachEventListenersToButtons() {
    // Corrected selectors for your buttons based on your HTML structure
    document.querySelectorAll('.custom-edit-btn').forEach(button => {
        button.onclick = (e) => editBooking(e.target.dataset.id); // Call your existing editBooking
    });
    document.querySelectorAll('.custom-delete-btn').forEach(button => {
        button.onclick = (e) => deleteBooking(e.target.dataset.id); // Call your existing deleteBooking
    });
    document.querySelectorAll('.assign-room-dropdown').forEach(dropdown => {
        dropdown.onchange = (e) => handleAssignRoom(e.target.dataset.id, e.target.value);
    });
}

document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    // When searching, you'll want to re-fetch *all* bookings matching the term, then re-render pagination
    fetchBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('input', () => {
    // For live search, re-fetch and re-render.
    // This can be heavy if many bookings. Consider a debounce or separate client-side filtering if performance is an issue.
    const searchTerm = document.getElementById('search-input').value.trim();
    fetchBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});

// Event handler for assigning a room
async function handleAssignRoom(bookingId, roomNumber) {
    if (!roomNumber) {
        console.log(`Booking ${bookingId}: Room unassigned.`);
        return; // Do nothing if "Assign Room" is selected
    }

    try {
        // You need the booking's date for the backend conflict check.
        // Find the booking in bookingsData
        const bookingToUpdate = bookingsData.find(b => b._id === bookingId);
        if (!bookingToUpdate) {
            console.error('Booking not found in local data for assignment.');
            showMessage('Error: Booking not found for assignment.', 'error', 'edit-message');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/assign-room/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomNumber, date: bookingToUpdate.date }), // Send the actual booking date
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to assign room');
        }
        showMessage('Room assigned successfully!', 'success', 'edit-message');
        fetchBookings(); // Refresh table to show assigned room

    } catch (error) {
        console.error('Error assigning room:', error);
        showMessage('Failed to assign room: ' + error.message, 'error', 'edit-message');
    }
}

// --- Your existing CRUD functions (editBooking, handleEditSubmit, showDeleteModal, deleteBooking, createBookingManual) ---
// Just make sure they call fetchBookings() after successful operations to refresh the table.

// Example: `editBooking` calls `fetchBookings()`
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
        editForm.removeEventListener('submit', handleEditSubmit); // Prevent duplicate listeners
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
        const response = await fetch(`${API_BASE_URL}/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBookingData),
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('Booking updated successfully!', 'success', 'edit-message');
            document.getElementById('edit-booking-form').classList.add('hidden');
            await fetchBookings(); // Refresh the table
        } else {
            showMessage(data.message || 'Failed to update booking.', 'error', 'edit-message');
        }
    } catch (error) {
        showMessage('Error updating booking. Please check your network.', 'error', 'edit-message');
    }
}

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
        const response = await fetch(`${API_BASE_URL}/${deleteId}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            showMessage('Booking deleted successfully!', 'success', 'edit-message');
            await fetchBookings(); // Refresh the table
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
    const newBookingData = { service: createService, date: createDate, time: createTime, name: createName, email: createEmail };

    document.getElementById('booking-spinner').classList.remove('hidden');
    try {
        const response = await fetch(`${API_BASE_URL}/manual`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookingData),
        });
        const data = await response.json();
        document.getElementById('booking-spinner').classList.add('hidden');
        const message = response.ok ? 'Booking created successfully!' : data.message || 'Failed to create booking.';
        const resultModal = document.getElementById('booking-result-modal');
        const resultMessage = document.getElementById('booking-result-message');
        resultMessage.textContent = message;
        resultModal.classList.remove('hidden');

        if (response.ok) {
            document.getElementById('create-form').reset();
            await fetchBookings(); // Refresh the table
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

// --- Admin Login ---
document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
            await fetchBookings(); // Load bookings after login
        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch (err) {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});

// --- Logout Function ---
function handleLogout() {
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    showMessage('You have been logged out.', 'success', 'login-message'); // Use login-message for consistency
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
    fetchBookings(); // Re-fetch bookings when switching to bookings tab
});

// --- Initial App Load ---
async function initializeApp() {
    console.log("Initializing application...");
    await fetchRooms(); // Fetch rooms first
    // The initial fetchBookings will happen upon successful login or if not behind login.
    // If you always want to load bookings on DOMContentLoaded, even before login,
    // you can uncomment await fetchBookings() here.
    // For an admin panel, it typically loads after successful login.
    console.log("Application initialized.");
}

// Listen for DOM content loaded to start the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    // Event listener for manual booking form submit
    const createForm = document.getElementById('create-form');
    if (createForm) { // Check if form exists
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Your form submission logic is in createBookingManual,
            // so this listener should likely just call that.
            createBookingManual();
        });
    }
});
