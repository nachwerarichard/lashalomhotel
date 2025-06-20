
const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings';
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login';

let allBookings = [];
let currentPage = 1;
const rowsPerPage = 5;

function showMessage(message, type, targetId) {
    const messageDiv = document.getElementById(targetId);
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = type;
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

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function fetchBookings(searchTerm = '') {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '<tr><td colspan="7">Loading bookings...</td></tr>';

    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const bookings = await fetchData(`${API_BASE_URL}/admin${query}`);

        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="7">No bookings found.</td></tr>';
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        allBookings = bookings;
        currentPage = 1;
        displayBookingsPage(currentPage);
    } catch (error) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

function displayBookingsPage(page) {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedBookings = allBookings.slice(start, end);

    paginatedBookings.forEach(booking => {
        const row = document.createElement('tr');
        const buttons = `
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
            <td>${buttons}</td>
        `;
        bookingsTableBody.appendChild(row);
    });

    attachEventListenersToButtons();

    const totalPages = Math.ceil(allBookings.length / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('pagination').style.display = totalPages > 1 ? 'flex' : 'none';
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayBookingsPage(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(allBookings.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayBookingsPage(currentPage);
    }
});

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
            fetchBookings();
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

async function createBookingManual(event) {
    event.preventDefault();

    const newBookingData = {
        service: document.getElementById('create-service').value,
        date: document.getElementById('create-date').value,
        time: document.getElementById('create-time').value,
        name: document.getElementById('create-name').value,
        email: document.getElementById('create-email').value,
    };

    if (Object.values(newBookingData).some(v => !v)) {
        showMessage('Please fill in all fields.', 'error', 'create-message');
        return;
    }

    document.getElementById('booking-spinner').classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/manual`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookingData),
        });

        const data = await response.json();
        document.getElementById('booking-spinner').classList.add('hidden');

        const message = response.ok
            ? 'Booking created successfully!'
            : data.message || 'Failed to create booking.';
        document.getElementById('booking-result-message').textContent = message;
        document.getElementById('booking-result-modal').classList.remove('hidden');

        if (response.ok) {
            document.getElementById('create-form').reset();
            fetchBookings();
        }

    } catch (error) {
        document.getElementById('booking-spinner').classList.add('hidden');
        document.getElementById('booking-result-message').textContent = 'Network error. Try again.';
        document.getElementById('booking-result-modal').classList.remove('hidden');
    }
}

document.getElementById('close-result-modal').addEventListener('click', () => {
    document.getElementById('booking-result-modal').classList.add('hidden');
});

function attachEventListenersToButtons() {
    document.querySelectorAll('.custom-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editBooking(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.custom-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteBooking(btn.getAttribute('data-id')));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
    document.getElementById('create-form').addEventListener('submit', createBookingManual);
});

document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('dashboard-content').classList.remove('hidden');
            fetchBookings();
        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});

function handleLogout() {
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    showMessage('You have been logged out.', 'success', 'create-message');
}

document.getElementById('logout-btn').addEventListener('click', handleLogout);

document.getElementById('dashboard-tab').addEventListener('click', () => {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('bookings-section').style.display = 'none';
});

document.getElementById('bookings-tab').addEventListener('click', () => {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'block';
});

