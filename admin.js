const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings';
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login';

let bookingsData = [];
let roomList = [];
let currentPage = 1;
const rowsPerPage = 4;

// --- Utility: Show message ---
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

// --- Fetch Utility ---
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

// --- Load Rooms First ---
async function loadRooms() {
    try {
        roomList = await fetchData(`${API_BASE_URL}/rooms`);
        await fetchBookings(); // Continue after room list is loaded
    } catch (err) {
        console.error('Room loading error:', err);
    }
}

// --- Fetch Bookings from API ---
async function fetchBookings(searchTerm = '') {
    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const bookings = await fetchData(`${API_BASE_URL}/admin${query}`);
        bookingsData = bookings || [];
        renderTablePage(currentPage);
        renderPagination();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        document.querySelector('#bookings-table tbody').innerHTML =
            '<tr><td colspan="8">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

// --- Render current page of bookings ---
function renderTablePage(page) {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, bookingsData.length);
    const currentBookings = bookingsData.slice(startIndex, endIndex);

    if (currentBookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="8">No bookings found.</td></tr>';
        return;
    }

    currentBookings.forEach(booking => {
        const row = document.createElement('tr');

        const roomDropdown = roomList && roomList.length
            ? `<select class="assign-room-dropdown" data-id="${booking._id}" data-date="${booking.date}">
                <option value="">Assign Room</option>
                ${roomList.map(r => `<option value="${r.number}">${r.number}</option>`).join('')}
               </select>`
            : '<span class="text-red-500">No rooms loaded</span>';

        row.innerHTML = `
            <td>${booking._id}</td>
            <td>${booking.service}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>${booking.time}</td>
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>
                <button class="edit-button bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded" data-id="${booking._id}">Edit</button>
                <button class="delete-button bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded" data-id="${booking._id}">Delete</button>
            </td>
            <td>${roomDropdown}</td>
        `;

        bookingsTableBody.appendChild(row);
    });

    attachEventListenersToButtons();
    attachRoomAssignmentListeners();
}

// --- Pagination ---
function renderPagination() {
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTablePage(currentPage);
        renderPagination();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTablePage(currentPage);
        renderPagination();
    }
});

// --- Room Assignment Event Binding ---
function attachRoomAssignmentListeners() {
    document.querySelectorAll('.assign-room-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', async (e) => {
            const bookingId = e.target.dataset.id;
            const selectedRoom = e.target.value;
            const date = e.target.dataset.date;

            try {
                const res = await fetch(`${API_BASE_URL}/assign-room/${bookingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomNumber: selectedRoom, date })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to assign room');
                alert('Room assigned successfully');
                fetchBookings(); // Refresh
            } catch (err) {
                alert(err.message);
            }
        });
    });
}

// --- Edit & Delete ---
function attachEventListenersToButtons() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => editBooking(button.dataset.id));
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => deleteBooking(button.dataset.id));
    });
}

// --- Login ---
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
            loadRooms(); // Initial load
        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch (err) {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});

// --- Logout ---
document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    showMessage('You have been logged out.', 'success', 'create-message');
});

// --- Search Input Filtering ---
document.getElementById('search-input').addEventListener('input', () => {
    const searchTerm = document.getElementById('search-input').value.trim();
    fetchBookings(searchTerm);
});

// --- Tab Switching ---
document.getElementById('dashboard-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('bookings-section').style.display = 'none';
});

document.getElementById('bookings-tab').addEventListener('click', function () {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'block';
});

// --- Edit Booking ---
async function editBooking(id) {
    try {
        const booking = await fetchData(`${API_BASE_URL}/${id}`);
        document.getElementById('edit-id').value = booking._id;
        document.getElementById('edit-service').value = booking.service;
        document.getElementById('edit-date').value = new Date(booking.date).toISOString().split('T')[0];
        document.getElementById('edit-time').value = booking.time;
        document.getElementById('edit-name').value = booking.name;
        document.getElementById('edit-email').value = booking.email;

        document.getElementById('edit-booking-form').classList.remove('hidden');

        const form = document.getElementById('edit-form');
        form.removeEventListener('submit', handleEditSubmit);
        form.addEventListener('submit', handleEditSubmit);
    } catch {
        showMessage('Failed to fetch booking for editing.', 'error', 'edit-message');
    }
}

async function handleEditSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updated = {
        service: document.getElementById('edit-service').value,
        date: document.getElementById('edit-date').value,
        time: document.getElementById('edit-time').value,
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });

        const data = await res.json();

        if (res.ok) {
            showMessage('Booking updated successfully.', 'success', 'edit-message');
            document.getElementById('edit-booking-form').classList.add('hidden');
            fetchBookings();
        } else {
            showMessage(data.message || 'Update failed.', 'error', 'edit-message');
        }
    } catch {
        showMessage('Error updating booking.', 'error', 'edit-message');
    }
}

// --- Delete Booking ---
let deleteId = null;

function deleteBooking(id) {
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
    } catch {
        showMessage('Error deleting booking.', 'error', 'edit-message');
    } finally {
        deleteId = null;
        document.getElementById('delete-modal').classList.add('hidden');
    }
});

// --- Initial load ---
document.addEventListener('DOMContentLoaded', () => {
    // Wait for admin login before loading
});
