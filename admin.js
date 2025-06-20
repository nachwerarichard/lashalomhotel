const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login'; // adjust to your actual endpoint

// --- Global variables for pagination ---
let bookingsData = []; // Stores all fetched bookings
let currentPage = 1;
const rowsPerPage = 5; // Maximum number of rows per page

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

document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    filterAndRenderBookings(searchTerm);
});

document.getElementById('search-input').addEventListener('input', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    filterAndRenderBookings(searchTerm);
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
 * Fetches all bookings from the API, stores them, and then renders the first page.
 */
async function fetchBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const bookings = await fetchData(`${API_BASE_URL}/admin`);
        bookingsData = bookings || []; // Store all fetched bookings

        if (bookingsData.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            document.getElementById('pagination-controls').classList.add('hidden'); // Hide pagination if no bookings
            return;
        }

        document.getElementById('pagination-controls').classList.remove('hidden');
        currentPage = 1; // Reset to first page when new data is fetched
        renderBookingsTablePage();

    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
        document.getElementById('pagination-controls').classList.add('hidden'); // Hide pagination on error
    }
}

/**
 * Renders the bookings for the current page in the table.
 */
function renderBookingsTablePage() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const bookingsToDisplay = bookingsData.slice(startIndex, endIndex);

    if (bookingsToDisplay.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found for this page.</td></tr>';
        return;
    }

    bookingsToDisplay.forEach(booking => {
        const row = document.createElement('tr');
        const buttonHTML = `
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
        bookingsTableBody.appendChild(row);
    });

    attachEventListenersToButtons();
    renderPaginationControls();
}

/**
 * Updates the pagination controls (previous, next, page info).
 */
function renderPaginationControls() {
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages || 1}`; // Show "Page 1 of 1" if no bookings
}

/**
 * Filters bookings based on search term and renders the first page of results.
 * @param {string} searchTerm - The term to search for.
 */
function filterAndRenderBookings(searchTerm = '') {
    const filteredBookings = bookingsData.filter(booking => {
        const rowText = `${booking._id} ${booking.service} ${new Date(booking.date).toLocaleDateString()} ${booking.time} ${booking.name} ${booking.email}`.toLowerCase();
        return rowText.includes(searchTerm.toLowerCase());
    });

    // Temporarily update bookingsData to reflect filtered results for pagination calculation
    const originalBookingsData = [...bookingsData]; // Store original
    bookingsData = filteredBookings;

    currentPage = 1; // Always go to the first page of filtered results
    renderBookingsTablePage();

    bookingsData = originalBookingsData; // Restore original for next fetch/filter
}


/**
 * Handles editing a booking.
 * @param {string} id - The ID of the booking to edit.
 */
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
            fetchBookings(); // Re-fetch all bookings to refresh the table with updated data
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
            fetchBookings(); // Re-fetch all bookings to refresh the table
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

/**
 * Handles the submission of the create booking form.
 */
async function createBookingManual(event) {
    event.preventDefault(); // Prevent default form submission

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
            fetchBookings(); // Re-fetch all bookings to include the new one
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
    // Select buttons by their correct classes
    document.querySelectorAll('.custom-edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            editBooking(bookingId);
        });
    });

    document.querySelectorAll('.custom-delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            deleteBooking(bookingId);
        });
    });
}

// Initial load and form submission listener
document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();

    const createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', createBookingManual);

    // Pagination button event listeners
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBookingsTablePage();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderBookingsTablePage();
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
    // When switching to the bookings tab, ensure the table is rendered for the current page
    renderBookingsTablePage();
});

// Modified search input listener to use the new filterAndRenderBookings
document.getElementById('search-input').addEventListener('input', function () {
    const searchValue = this.value.trim();
    filterAndRenderBookings(searchValue);
});
