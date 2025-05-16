const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings'; // Adjust if needed
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login'; // adjust to your actual endpoint

// --- Utility Functions ---

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
}
*/
/*function showMessage(message, type = 'info') {
    const modal = document.getElementById('booking-result-modal');
    const messageElement = document.getElementById('booking-result-message');

    // Set message text
    messageElement.textContent = message;

    // Apply color based on type
    if (type === 'success') {
        messageElement.className = 'text-green-600 text-lg text-center';
    } else if (type === 'error') {
        messageElement.className = 'text-red-600 text-lg text-center';
    } else {
        messageElement.className = 'text-gray-600 text-lg text-center';
    }

    // Show modal
    modal.classList.remove('hidden');
}*/
/*function showMessage(message, type = 'info', elementId = 'create-message', delay = 800) {
    const messageEl = document.getElementById(elementId);
    const spinner = document.getElementById('booking-spinner');

    // Show spinner first
    if (spinner) {
        spinner.classList.remove('hidden');
    }

    // After delay, show the message and hide the spinner
    setTimeout(() => {
        if (spinner) {
            spinner.classList.add('hidden');
        }

        if (messageEl) {
            messageEl.textContent = message;
            messageEl.classList.remove('hidden');
            messageEl.classList.remove('text-red-500', 'text-green-500', 'text-blue-500');

            // Apply appropriate color
            if (type === 'error') {
                messageEl.classList.add('text-red-500');
            } else if (type === 'success') {
                messageEl.classList.add('text-green-500');
            } else {
                messageEl.classList.add('text-blue-500');
            }
        }
    }, delay);
}
*/
function showMessage(message, type = 'info', delay = 800, useSpinner = true) {
    const spinner = document.getElementById('booking-spinner');
    const modal = document.getElementById('message-modal');
    const modalText = document.getElementById('message-modal-text');

    // Show spinner if enabled
    if (useSpinner && spinner) {
        spinner.classList.remove('hidden');
    }

    setTimeout(() => {
        // Hide spinner
        if (useSpinner && spinner) {
            spinner.classList.add('hidden');
        }

        // Set message text
        if (modalText) {
            modalText.textContent = message;
            modalText.className = 'text-lg font-medium'; // reset classes

            // Add color based on type
            if (type === 'error') {
                modalText.classList.add('text-red-600');
            } else if (type === 'success') {
                modalText.classList.add('text-green-600');
            } else {
                modalText.classList.add('text-blue-600');
            }
        }

        // Show message modal
        if (modal) {
            modal.classList.remove('hidden');
        }
    }, delay);
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
async function fetchBookings() {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const bookings = await fetchData(`${API_BASE_URL}/admin`);
        bookingsData = bookings || [];
        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            return;
        }
        const maxRows = 4;
        const limitedBookings = bookings.slice(0, maxRows);
        bookingsTableBody.innerHTML = '';
        limitedBookings.forEach(booking => {
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
        renderTablePage(currentPage);
        renderPagination();

    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
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
