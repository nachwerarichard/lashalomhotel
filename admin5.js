// admin.js - CONSOLIDATED JAVASCRIPT FOR BOOKING ENGINE ADMIN DASHBOARD

// --- API Endpoints ---
const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings';
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login';
const ROOMS_API_URL = 'https://bookingenginebackend.onrender.com/api/rooms';
const ROOM_BLOCKS_API_URL = 'https://bookingenginebackend.onrender.com/api/roomblocks'; // NEW

// --- Global Variables ---
let bookingsData = []; // Stores all fetched booking data for client-side access
let allRooms = [];     // Stores all fetched room data
let currentPage = 1;   // For pagination (if implemented later)
const rowsPerPage = 4; // For pagination (if implemented later)

// --- Element References ---
// Login Form
const loginForm = document.getElementById('login-form');
const adminLoginForm = document.getElementById('admin-login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessageDiv = document.getElementById('login-message');

// Dashboard Content & General Message Area
const dashboardContent = document.getElementById('dashboard-content');
const dashboardSection = document.getElementById('dashboard-section');
const dashboardMessageArea = document.getElementById('dashboard-message-area'); // General message area
const activeReservationsSpan = document.getElementById('active-reservations'); // For reservation count

// Sidebar & Navigation
const mobileSidebar = document.getElementById('mobile-sidebar');
const hamburgerBtn = document.getElementById('hamburger-btn'); // Assuming you have this button to open sidebar
const closeSidebarBtn = document.getElementById('close-sidebar');
const logoutBtnMobile = document.getElementById('logout-btn-mobile');
const logoutBtnDesktop = document.getElementById('logout-btn'); // Desktop logout button

// Bookings Section
const bookingsSection = document.getElementById('bookings-section');
const bookingsTableBody = document.querySelector('#bookings-table tbody');
const searchInput = document.getElementById('search-input');
const openCreateModalBtn = document.getElementById('open-create-modal');

// Create Booking Modal
const createBookingModal = document.getElementById('create-booking-modal');
const closeCreateModalBtn = document.getElementById('close-create-modal');
const createForm = document.getElementById('create-form');
const createServiceSelect = document.getElementById('create-service');
const createCheckInDateInput = document.getElementById('create-check-in-date'); // NEW
const createCheckOutDateInput = document.getElementById('create-check-out-date'); // NEW
const createNumGuestsInput = document.getElementById('create-num-guests'); // NEW
const createAssignRoomSelect = document.getElementById('create-assign-room'); // NEW
const createNameInput = document.getElementById('create-name');
const createEmailInput = document.getElementById('create-email');
const createMessageDiv = document.getElementById('create-message');

// Edit Booking Modal (Repurposed from edit-booking-form)
const editBookingModal = document.getElementById('edit-booking-modal'); // Now this is the modal wrapper
const editForm = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editServiceModalSelect = document.getElementById('edit-service-modal');
const editNameModalInput = document.getElementById('edit-name-modal');
const editEmailModalInput = document.getElementById('edit-email-modal');
const editCheckInDateModalInput = document.getElementById('edit-check-in-date-modal'); // NEW
const editCheckOutDateModalInput = document.getElementById('edit-check-out-date-modal'); // NEW
const editNumGuestsModalInput = document.getElementById('edit-num-guests-modal'); // NEW
const editAssignRoomSelect = document.getElementById('edit-assign-room'); // NEW
const editBookingStatusModalSelect = document.getElementById('edit-booking-status-modal'); // NEW
const editMessageDiv = document.getElementById('edit-message');
const cancelEditBookingModalBtn = document.getElementById('cancel-edit-booking-modal-btn'); // New cancel button for edit modal

// Booking Confirmation/Result Modal (combined success/error)
const bookingResultModal = document.getElementById('booking-result-modal');
const bookingResultMessage = document.getElementById('booking-result-message');
const closeResultModalBtn = document.getElementById('close-result-modal');

// Delete Booking Modal
const deleteBookingModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const deleteBookingMessageDiv = document.getElementById('delete-booking-message'); // Specific message for delete modal
let deleteBookingId = null; // To store ID of booking to delete

// Rooms Section
const roomsSection = document.getElementById('rooms-section');
const roomsTableBody = document.querySelector('#rooms-table tbody');
const addRoomBtn = document.getElementById('add-room-btn');

// Room Add/Edit Modal
const roomModal = document.getElementById('room-modal');
const roomForm = document.getElementById('room-form');
const roomIdInput = document.getElementById('room-id');
const roomModalTitle = document.getElementById('room-modal-title');
const roomNumberInput = document.getElementById('room-number');
const roomTypeSelect = document.getElementById('room-type');
const roomCapacityInput = document.getElementById('room-capacity');
const roomPriceInput = document.getElementById('room-price');
const roomStatusSelect = document.getElementById('room-status');
const roomFeaturesInput = document.getElementById('room-features');
const roomNotesInput = document.getElementById('room-notes');
const roomMessageDiv = document.getElementById('room-message');
const cancelRoomBtn = document.getElementById('cancel-room-btn');

// Room Delete Modal
const deleteRoomModal = document.getElementById('delete-room-modal');
const confirmDeleteRoomBtn = document.getElementById('confirm-delete-room-btn');
const cancelDeleteRoomBtn = document.getElementById('cancel-delete-room-btn');
const deleteRoomMessageDiv = document.getElementById('delete-room-message');
let deleteRoomId = null;

// Room Blocking Section (NEW)
const roomBlockingSection = document.getElementById('room-blocking-section');
const roomBlockForm = document.getElementById('room-block-form');
const blockRoomSelect = document.getElementById('block-room-select');
const blockStartDateInput = document.getElementById('block-start-date');
const blockEndDateInput = document.getElementById('block-end-date');
const blockReasonInput = document.getElementById('block-reason');
const blockMessageDiv = document.getElementById('block-message');
const roomBlocksTableBody = document.querySelector('#room-blocks-table tbody');


// --- Utility Functions ---

/** Displays a message to the user in a designated element. */
function showMessage(message, type, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `p-3 rounded text-sm mt-4 text-center ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
        element.classList.remove('hidden');
        setTimeout(() => element.classList.add('hidden'), 5000);
    } else {
        console.error(`Message target element with id "${elementId}" not found.`);
    }
}

/** Fetches data from the API and handles errors. */
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

/** Formats a date string into a readable format (e.g., "Jan 1, 2024"). */
function formatDateForDisplay(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Check if date is valid
        return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}


// --- Sidebar and Section Management ---

/** Hides all main content sections. */
function hideAllSections() {
    [dashboardSection, bookingsSection, roomsSection, roomBlockingSection, settingsSection].forEach(section => {
        if (section) section.classList.add('hidden');
    });
}

/** Opens the mobile sidebar. */
function openSidebar() {
    if (mobileSidebar) mobileSidebar.classList.remove('-translate-x-full');
}

/** Closes the mobile sidebar. */
function closeSidebar() {
    if (mobileSidebar) mobileSidebar.classList.add('-translate-x-full');
}


// --- Authentication & Logout ---

/** Handles admin login form submission. */
adminLoginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(ADMIN_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            loginForm.classList.add('hidden');
            dashboardContent.classList.remove('hidden');

            // Default to showing the dashboard after login
            hideAllSections();
            dashboardSection.classList.remove('hidden'); // Show dashboard

            // Initial data fetches for the dashboard and other sections
            fetchAllRooms(); // Fetch all rooms once on login for dropdowns
            fetchBookings(); // Load bookings
            fetchRooms();    // Load rooms for room management table
            fetchDashboardSummary(); // Load dashboard stats

        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch (err) {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});

/** Handles user logout. */
function handleLogout() {
    // Optionally clear any session data if used (e.g., localStorage.clear())

    dashboardContent.classList.add('hidden'); // Hide dashboard
    loginForm.classList.remove('hidden');    // Show login form

    usernameInput.value = ''; // Clear form fields
    passwordInput.value = '';

    showMessage('You have been logged out.', 'success', 'login-message'); // Show logout message on login form
}

// Attach logout event listeners
if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', handleLogout);
if (logoutBtnDesktop) logoutBtnDesktop.addEventListener('click', handleLogout);


// --- Dashboard Summary ---

/** Fetches and displays dashboard summary statistics. */
async function fetchDashboardSummary() {
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room.status === 'Available').length;

        document.getElementById('total-rooms').textContent = totalRooms;
        document.getElementById('available-rooms').textContent = availableRooms;

        // NEW: Fetch and display active reservations
        // This assumes your /api/bookings/admin route returns all bookings
        // and 'Confirmed' or 'Checked-In' are considered active.
        const bookings = await fetchData(`${API_BASE_URL}/admin`);
        const activeReservations = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked-In').length;
        activeReservationsSpan.textContent = activeReservations;

    } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
        // showMessage('Failed to load dashboard summary.', 'error', 'dashboard-message-area');
    }
}


// --- Booking Management ---

/** Fetches and displays bookings in the table. */
async function fetchBookings(searchTerm = '') {
    if (!bookingsTableBody) return;

    bookingsTableBody.innerHTML = '<tr><td colspan="9" class="text-center p-4">Loading bookings...</td></tr>'; // colspan updated

    try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        const bookings = await fetchData(`${API_BASE_URL}/admin${query}`); // Backend must populate 'room'
        bookingsData = bookings || [];

        if (!bookings || bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="9" class="text-center p-4">No bookings found.</td></tr>';
            return;
        }

        // The user's original code had `maxRows` and `limitedBookings`.
        // If pagination is desired, this section needs to be integrated with `renderTablePage` and `renderPagination`.
        // For now, I'm displaying all fetched bookings.
        // const limitedBookings = bookings.slice(0, maxRows); // If using client-side pagination limit

        bookingsTableBody.innerHTML = '';
        bookings.forEach(booking => {
            const row = document.createElement('tr');

            let statusClass = '';
            switch (booking.status) {
                case 'Confirmed': statusClass = 'bg-green-100 text-green-800'; break;
                case 'Checked-In': statusClass = 'bg-blue-100 text-blue-800'; break;
                case 'Checked-Out': statusClass = 'bg-gray-100 text-gray-800'; break;
                case 'Cancelled': statusClass = 'bg-red-100 text-red-800'; break;
                default: statusClass = 'bg-yellow-100 text-yellow-800'; break; // Pending
            }

            let actionButtons = `
                <button class="custom-edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm mr-2" data-id="${booking._id}">Edit</button>
                <button class="custom-delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm" data-id="${booking._id}">Delete</button>
            `;
            if ((booking.status === 'Confirmed' || booking.status === 'Pending') && booking.room) {
                actionButtons += `<button class="check-in-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm mt-2 md:mt-0 ml-0 md:ml-2" data-id="${booking._id}">Check-In</button>`;
            }
            if (booking.status === 'Checked-In') {
                actionButtons += `<button class="check-out-btn bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm mt-2 md:mt-0 ml-0 md:ml-2" data-id="${booking._id}">Check-Out</button>`;
            }

            row.innerHTML = `
                <td class="px-2 py-2 border text-sm text-gray-900">${booking._id.substring(0, 8)}...</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${booking.service}</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${booking.name}</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${booking.email}</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${formatDateForDisplay(booking.checkInDate)}</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${formatDateForDisplay(booking.checkOutDate)}</td>
                <td class="px-2 py-2 border text-sm text-gray-900">${booking.room ? booking.room.roomNumber : 'N/A'}</td>
                <td class="px-2 py-2 border">
                    <span class="inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${booking.status}
                    </span>
                </td>
                <td class="px-2 py-2 border flex flex-wrap gap-2">${actionButtons}</td>
            `;
            bookingsTableBody.appendChild(row);
        });

        attachEventListenersToBookingButtons(); // Attach listeners after rows are added

    } catch (error) {
        console.error("Error in fetchBookings:", error);
        bookingsTableBody.innerHTML = '<tr><td colspan="9" class="text-center p-4 text-red-500">Failed to load bookings. Please check your network and backend.</td></tr>';
    }
}

/** Attaches event listeners to Edit, Delete, Check-In, and Check-Out buttons for bookings. */
function attachEventListenersToBookingButtons() {
    document.querySelectorAll('.custom-edit-btn').forEach(button => {
        button.addEventListener('click', () => editBooking(button.dataset.id));
    });
    document.querySelectorAll('.custom-delete-btn').forEach(button => {
        button.addEventListener('click', () => showDeleteBookingModal(button.dataset.id));
    });
    document.querySelectorAll('.check-in-btn').forEach(button => {
        button.addEventListener('click', () => handleCheckIn(button.dataset.id));
    });
    document.querySelectorAll('.check-out-btn').forEach(button => {
        button.addEventListener('click', () => handleCheckOut(button.dataset.id));
    });
}

// Search functionality for bookings
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        fetchBookings(searchTerm); // Trigger fetch with search term
    });
}
// This part handles the search button if you still use it explicitly
// document.getElementById('search-btn').addEventListener('click', () => {
//     const searchTerm = document.getElementById('search-input').value.trim();
//     fetchBookings(searchTerm);
// });


// --- Create Booking (New) ---

/** Opens the create new booking modal. */
if (openCreateModalBtn) {
    openCreateModalBtn.addEventListener('click', async () => {
        createForm.reset();
        createMessageDiv.classList.add('hidden');
        createMessageDiv.textContent = '';

        // Pre-populate available rooms based on default dates (or current date + 1 day)
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
        createCheckInDateInput.value = today;
        createCheckOutDateInput.value = tomorrow;

        // Fetch and populate available rooms for the default dates
        await fetchAvailableRoomsForBookingDates(createAssignRoomSelect, today, tomorrow, null);

        createBookingModal.classList.remove('hidden');
    });
}

/** Closes the create new booking modal. */
if (closeCreateModalBtn) {
    closeCreateModalBtn.addEventListener('click', () => {
        createBookingModal.classList.add('hidden');
    });
}

/** Event listener for date changes in create modal to refresh room availability. */
if (createCheckInDateInput) {
    createCheckInDateInput.addEventListener('change', () => {
        fetchAvailableRoomsForBookingDates(createAssignRoomSelect, createCheckInDateInput.value, createCheckOutDateInput.value, null);
    });
}
if (createCheckOutDateInput) {
    createCheckOutDateInput.addEventListener('change', () => {
        fetchAvailableRoomsForBookingDates(createAssignRoomSelect, createCheckInDateInput.value, createCheckOutDateInput.value, null);
    });
}


/** Handles submission of the create booking form. */
createForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const service = createServiceSelect.value;
    const checkInDate = createCheckInDateInput.value;
    const checkOutDate = createCheckOutDateInput.value;
    const numberOfGuests = parseInt(createNumGuestsInput.value);
    const assignedRoomId = createAssignRoomSelect.value;
    const name = createNameInput.value.trim();
    const email = createEmailInput.value.trim();

    if (!name || !email || !checkInDate || !checkOutDate || isNaN(numberOfGuests) || numberOfGuests < 1) {
        showMessage('Please fill in all required fields.', 'error', 'create-message');
        return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        showMessage('Check-out date must be after check-in date.', 'error', 'create-message');
        return;
    }
    if (service === 'Room Booking' && !assignedRoomId) {
         showMessage('Please select a room for room bookings.', 'error', 'create-message');
         return;
    }

    const newBookingData = {
        service,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        room: assignedRoomId || null, // Send room ID or null
        name,
        email,
        status: 'Pending' // Default status for new bookings
    };

    // Show loading spinner for create operation
    if (document.getElementById('loading-spinner')) {
        document.getElementById('loading-spinner').classList.remove('hidden');
    }

    try {
        // This POST endpoint handles new bookings. Backend needs to check room availability and block it.
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookingData),
        });
        const data = await response.json();

        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }

        if (response.ok) {
            showMessage('Booking created successfully!', 'success', 'booking-result-message');
            createForm.reset();
            createBookingModal.classList.add('hidden');
            bookingResultModal.classList.remove('hidden'); // Show generic result modal
            fetchBookings(); // Refresh bookings table
            fetchAllRooms(); // Refresh room data in case availability changed
            fetchDashboardSummary(); // Update active reservations count
        } else {
            showMessage(data.message || 'Failed to create booking.', 'error', 'booking-result-message');
            bookingResultModal.classList.remove('hidden'); // Show generic result modal
        }
    } catch (error) {
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }
        console.error('Error creating booking:', error);
        showMessage('Error creating booking. Please check your network.', 'error', 'booking-result-message');
        bookingResultModal.classList.remove('hidden'); // Show generic result modal
    }
});

// Close general booking result modal
if (closeResultModalBtn) {
    closeResultModalBtn.addEventListener('click', () => {
        bookingResultModal.classList.add('hidden');
    });
}


// --- Edit Booking (New Modal Logic) ---

/** Populates the edit booking modal with data and available rooms. */
async function editBooking(id) {
    try {
        const booking = bookingsData.find(b => b._id === id); // Try to find in already fetched data first
        if (!booking) {
            // If not found in current list (e.g., due to pagination/search), fetch individually
            const fetchedBooking = await fetchData(`${API_BASE_URL}/${id}`);
            // Add/update this booking in the global bookingsData array if needed
            bookingsData = bookingsData.map(b => b._id === id ? fetchedBooking : b);
            booking = fetchedBooking;
        }

        if (!booking) {
            showMessage('Booking not found.', 'error', 'dashboard-message-area');
            return;
        }

        editIdInput.value = booking._id;
        editServiceModalSelect.value = booking.service;
        editNameModalInput.value = booking.name;
        editEmailModalInput.value = booking.email;
        editCheckInDateModalInput.value = booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : '';
        editCheckOutDateModalInput.value = booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split('T')[0] : '';
        editNumGuestsModalInput.value = booking.numberOfGuests || 1; // Default to 1 if not set
        editBookingStatusModalSelect.value = booking.status;

        // Fetch and populate available rooms for the current booking dates (excluding this booking's own room if assigned)
        await fetchAvailableRoomsForBookingDates(
            editAssignRoomSelect,
            editCheckInDateModalInput.value,
            editCheckOutDateModalInput.value,
            booking.room ? booking.room._id : null
        );

        // Set the assigned room dropdown value AFTER it's populated
        if (booking.room && booking.room._id) {
            editAssignRoomSelect.value = booking.room._id;
        } else {
            editAssignRoomSelect.value = ''; // No room assigned
        }

        editMessageDiv.classList.add('hidden'); // Hide any previous messages
        editBookingModal.classList.remove('hidden'); // Show the modal

    } catch (error) {
        console.error("Error editing booking:", error);
        showMessage('Failed to load booking details for editing.', 'error', 'dashboard-message-area');
    }
}

/** Handles submission of the edit booking form. */
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = editIdInput.value;
    const oldBooking = bookingsData.find(b => b._id === id); // Get the original booking for comparison

    const service = editServiceModalSelect.value;
    const checkInDate = editCheckInDateModalInput.value;
    const checkOutDate = editCheckOutDateModalInput.value;
    const numberOfGuests = parseInt(editNumGuestsModalInput.value);
    const assignedRoomId = editAssignRoomSelect.value; // Get the selected room ID
    const newStatus = editBookingStatusModalSelect.value; // Get the selected new status

    // Client-side validation
    if (!checkInDate || !checkOutDate || isNaN(numberOfGuests) || numberOfGuests < 1) {
        showMessage('Please fill in all required date and guest fields.', 'error', 'edit-message');
        return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        showMessage('Check-out date must be after check-in date.', 'error', 'edit-message');
        return;
    }
    if (service === 'Room Booking' && !assignedRoomId) {
         showMessage('Please select a room for room bookings.', 'error', 'edit-message');
         return;
    }

    const updateData = {
        service, // Allow service to be updated
        checkInDate,
        checkOutDate,
        numberOfGuests,
        status: newStatus,
        room: assignedRoomId === "" ? null : assignedRoomId, // Send null if unassigned
    };

    // Show loading spinner
    if (document.getElementById('loading-spinner')) {
        document.getElementById('loading-spinner').classList.remove('hidden');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        const data = await response.json();

        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }

        if (response.ok) {
            showMessage('Booking updated successfully!', 'success', 'dashboard-message-area'); // Show general message
            editBookingModal.classList.add('hidden'); // Hide modal
            fetchBookings(); // Refresh bookings table
            fetchAllRooms(); // Re-fetch all rooms to update their statuses (crucial for availability)
            fetchDashboardSummary(); // Update dashboard counts
        } else {
            showMessage(data.message || 'Failed to update booking.', 'error', 'edit-message'); // Show specific modal message
        }
    } catch (error) {
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }
        console.error('Error updating booking:', error);
        showMessage('Error updating booking. Please check your network.', 'error', 'edit-message');
    }
});

// Cancel button for the booking edit modal
if (cancelEditBookingModalBtn) {
    cancelEditBookingModalBtn.addEventListener('click', () => {
        editBookingModal.classList.add('hidden'); // Hide the modal
        editForm.reset(); // Clear form fields
        editMessageDiv.classList.add('hidden'); // Hide any messages
    });
}

// Event listeners for date changes in edit modal to refresh room availability.
if (editCheckInDateModalInput) {
    editCheckInDateModalInput.addEventListener('change', () => {
        const currentBookingId = editIdInput.value;
        fetchAvailableRoomsForBookingDates(
            editAssignRoomSelect,
            editCheckInDateModalInput.value,
            editCheckOutDateModalInput.value,
            currentBookingId // Pass booking ID to exclude its own room from conflict check
        );
    });
}
if (editCheckOutDateModalInput) {
    editCheckOutDateModalInput.addEventListener('change', () => {
        const currentBookingId = editIdInput.value;
        fetchAvailableRoomsForBookingDates(
            editAssignRoomSelect,
            editCheckInDateModalInput.value,
            editCheckOutDateModalInput.value,
            currentBookingId // Pass booking ID to exclude its own room from conflict check
        );
    });
}


// --- Room Assignment Dropdown Population (Shared between Create and Edit) ---

/**
 * Fetches available rooms for a given date range and populates a specific select element.
 * @param {HTMLSelectElement} selectElement - The dropdown element to populate (e.g., createAssignRoomSelect or editAssignRoomSelect).
 * @param {string} checkInDate - The proposed check-in date (YYYY-MM-DD).
 * @param {string} checkOutDate - The proposed check-out date (YYYY-MM-DD).
 * @param {string|null} excludeBookingId - Optional: If editing a booking, pass its ID to exclude its current room from conflict checks.
 */
async function fetchAvailableRoomsForBookingDates(selectElement, checkInDate, checkOutDate, excludeBookingId = null) {
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Loading available rooms...</option>';
    selectElement.disabled = true; // Disable while loading

    if (!checkInDate || !checkOutDate || new Date(checkInDate) >= new Date(checkOutDate)) {
        selectElement.innerHTML = '<option value="">Select dates first</option>';
        selectElement.disabled = false;
        return;
    }

    try {
        let url = `${ROOMS_API_URL}/available?checkInDate=${encodeURIComponent(checkInDate)}&checkOutDate=${encodeURIComponent(checkOutDate)}`;
        if (excludeBookingId) {
            url += `&excludeBookingId=${encodeURIComponent(excludeBookingId)}`;
        }

        const availableRooms = await fetchData(url);

        selectElement.innerHTML = '<option value="">Select a room (Available)</option>';
        selectElement.disabled = false;

        if (availableRooms.length === 0) {
            selectElement.innerHTML = '<option value="">No rooms available for these dates</option>';
            return;
        }

        // Sort rooms by roomNumber before populating
        availableRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: 'base' }))
                      .forEach(room => {
            const option = document.createElement('option');
            option.value = room._id;
            option.textContent = `${room.roomNumber} - ${room.roomType} (Capacity: ${room.capacity})`;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching available rooms for dates:", error);
        selectElement.innerHTML = '<option value="">Error loading rooms</option>';
        selectElement.disabled = false;
        // Show message in the respective modal
        const messageElementId = selectElement.id === 'create-assign-room' ? 'create-message' : 'edit-message';
        showMessage('Could not load available rooms for the selected dates.', 'error', messageElementId);
    }
}


// --- Booking Delete Modal Logic ---
let currentBookingIdToDelete = null;

function showDeleteBookingModal(id) {
    currentBookingIdToDelete = id;
    deleteBookingMessageDiv.classList.add('hidden');
    deleteBookingMessageDiv.textContent = '';
    deleteBookingModal.classList.remove('hidden');
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
        currentBookingIdToDelete = null;
        deleteBookingModal.classList.add('hidden');
    });
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!currentBookingIdToDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${currentBookingIdToDelete}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showMessage('Booking deleted successfully!', 'success', 'dashboard-message-area');
                deleteBookingModal.classList.add('hidden');
                fetchBookings(); // Refresh bookings table
                fetchAllRooms(); // Refresh room statuses
                fetchDashboardSummary(); // Update counts
            } else {
                showMessage(data.message || 'Failed to delete booking.', 'error', 'delete-booking-message');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            showMessage('Error deleting booking. Please check your network.', 'error', 'delete-booking-message');
        } finally {
            currentBookingIdToDelete = null;
        }
    });
}


// --- Check-In / Check-Out Handlers ---
async function handleCheckIn(bookingId) {
    if (!confirm('Are you sure you want to check in this guest?')) return; // Consider a custom modal instead of confirm()
    try {
        const booking = bookingsData.find(b => b._id === bookingId);
        if (!booking) {
            showMessage('Booking not found.', 'error', 'dashboard-message-area');
            return;
        }
        if (!booking.room) {
             showMessage('No room assigned. Please assign a room before checking in.', 'error', 'dashboard-message-area');
             return;
        }
        if (booking.status === 'Checked-In') {
            showMessage('Guest is already checked in.', 'info', 'dashboard-message-area');
            return;
        }

        // Show loading spinner
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.remove('hidden');
        }

        const response = await fetch(`${API_BASE_URL}/${bookingId}/checkin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }

        if (response.ok) {
            showMessage('Guest checked in successfully! Room status updated to Occupied.', 'success', 'dashboard-message-area');
            fetchBookings();
            fetchAllRooms(); // Refresh room data
            fetchDashboardSummary();
        } else {
            showMessage(data.message || 'Failed to check in guest.', 'error', 'dashboard-message-area');
        }
    } catch (error) {
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }
        console.error('Error during check-in:', error);
        showMessage('Network error during check-in.', 'error', 'dashboard-message-area');
    }
}

async function handleCheckOut(bookingId) {
    if (!confirm('Are you sure you want to check out this guest? This will mark the room as dirty.')) return; // Custom modal instead of confirm()
    try {
        const booking = bookingsData.find(b => b._id === bookingId);
        if (!booking) {
            showMessage('Booking not found.', 'error', 'dashboard-message-area');
            return;
        }
        if (booking.status !== 'Checked-In') {
            showMessage('Booking is not currently checked in.', 'info', 'dashboard-message-area');
            return;
        }

        // Show loading spinner
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.remove('hidden');
        }

        const response = await fetch(`${API_BASE_URL}/${bookingId}/checkout`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }

        if (response.ok) {
            showMessage('Guest checked out successfully! Room status updated to Cleaning.', 'success', 'dashboard-message-area');
            fetchBookings();
            fetchAllRooms(); // Refresh room data
            fetchDashboardSummary();
        } else {
            showMessage(data.message || 'Failed to check out guest.', 'error', 'dashboard-message-area');
        }
    } catch (error) {
        if (document.getElementById('loading-spinner')) {
            document.getElementById('loading-spinner').classList.add('hidden');
        }
        console.error('Error during check-out:', error);
        showMessage('Network error during check-out.', 'error', 'dashboard-message-area');
    }
}


// --- Room Management (existing from previous steps) ---

/** Fetches and displays rooms in the rooms table. */
async function fetchRooms() {
    if (!roomsTableBody) return;
    roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading rooms...</td></tr>';
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        if (!rooms || rooms.length === 0) {
            roomsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No rooms found. Click "Add New Room" to create one.</td></tr>';
            return;
        }

        roomsTableBody.innerHTML = '';
        rooms.forEach(room => {
            const row = document.createElement('tr');
            let statusClass = '';
            switch (room.status) {
                case 'Available': statusClass = 'bg-green-100 text-green-800'; break;
                case 'Occupied': statusClass = 'bg-red-100 text-red-800'; break;
                case 'Cleaning': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                case 'Maintenance': statusClass = 'bg-purple-100 text-purple-800'; break;
                case 'Out of Order': statusClass = 'bg-gray-100 text-gray-800'; break;
            }

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.roomNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.roomType}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.capacity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">UGX ${room.pricePerNight.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${statusClass}">
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

/** Populates the room modal for editing a specific room. */
async function editRoom(id) {
    try {
        const room = await fetchData(`${ROOMS_API_URL}/${id}`);
        roomIdInput.value = room._id;
        roomNumberInput.value = room.roomNumber;
        roomTypeSelect.value = room.roomType;
        roomCapacityInput.value = room.capacity;
        roomPriceInput.value = room.pricePerNight;
        roomStatusSelect.value = room.status;
        roomFeaturesInput.value = room.features.join(', ');
        roomNotesInput.value = room.notes || '';

        roomModalTitle.textContent = 'Edit Room';
        roomMessageDiv.classList.add('hidden');
        roomModal.classList.remove('hidden');
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
        roomNumber: roomNumberInput.value.trim(),
        roomType: roomTypeSelect.value,
        capacity: parseInt(roomCapacityInput.value),
        pricePerNight: parseFloat(roomPriceInput.value),
        status: roomStatusSelect.value,
        features: roomFeaturesInput.value.split(',').map(f => f.trim()).filter(f => f),
        notes: roomNotesInput.value.trim()
    };

    if (!roomData.roomNumber || !roomData.roomType || isNaN(roomData.capacity) || isNaN(roomData.pricePerNight)) {
        showMessage('Please fill in all required fields (Room Number, Type, Capacity, Price).', 'error', 'room-message');
        return;
    }
    if (roomData.capacity < 1) { showMessage('Capacity must be at least 1.', 'error', 'room-message'); return; }
    if (roomData.pricePerNight < 0) { showMessage('Price per night cannot be negative.', 'error', 'room-message'); return; }


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
            fetchRooms();
            fetchAllRooms(); // Update allRooms for dropdowns
            fetchDashboardSummary();
        } else {
            showMessage(data.message || 'Failed to save room.', 'error', 'room-message');
        }
    } catch (error) {
        console.error('Error saving room:', error);
        showMessage('Error saving room. Please check your network or server status.', 'error', 'room-message');
    }
});

// Event listeners for the Add/Edit Room Modal buttons
if (addRoomBtn) {
    addRoomBtn.addEventListener('click', () => {
        roomForm.reset();
        roomIdInput.value = '';
        roomModalTitle.textContent = 'Add New Room';
        roomMessageDiv.classList.add('hidden');
        roomMessageDiv.textContent = '';
        roomModal.classList.remove('hidden');
    });
}
if (cancelRoomBtn) {
    cancelRoomBtn.addEventListener('click', () => {
        roomModal.classList.add('hidden');
    });
}


// Room Delete Modal Logic
function showDeleteRoomModal(id) {
    deleteRoomId = id;
    deleteRoomMessageDiv.classList.add('hidden');
    deleteRoomMessageDiv.textContent = '';
    deleteRoomModal.classList.remove('hidden');
}

if (cancelDeleteRoomBtn) {
    cancelDeleteRoomBtn.addEventListener('click', () => {
        deleteRoomId = null;
        deleteRoomModal.classList.add('hidden');
    });
}

if (confirmDeleteRoomBtn) {
    confirmDeleteRoomBtn.addEventListener('click', async () => {
        if (!deleteRoomId) return;

        try {
            const response = await fetch(`${ROOMS_API_URL}/${deleteRoomId}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showMessage('Room deleted successfully!', 'success', 'dashboard-message-area'); // General message
                deleteRoomModal.classList.add('hidden');
                fetchRooms();
                fetchAllRooms(); // Update allRooms for dropdowns
                fetchDashboardSummary();
            } else {
                showMessage(data.message || 'Failed to delete room.', 'error', 'delete-room-message'); // Modal specific message
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            showMessage('Error deleting room. Please check your network or server status.', 'error', 'delete-room-message');
        } finally {
            deleteRoomId = null;
        }
    });
}

// --- Room Blocking (NEW) ---

/** Populates the select dropdown with all rooms for blocking. */
function populateBlockRoomDropdown() {
    if (!blockRoomSelect) return;
    blockRoomSelect.innerHTML = '<option value="">Select a room</option>';
    allRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: 'base' }))
            .forEach(room => {
                const option = document.createElement('option');
                option.value = room._id;
                option.textContent = `${room.roomNumber} - ${room.roomType} (${room.status})`;
                blockRoomSelect.appendChild(option);
            });
}

/** Fetches and displays current room blocks. */
async function fetchRoomBlocks() {
    if (!roomBlocksTableBody) return;
    roomBlocksTableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading room blocks...</td></tr>';
    try {
        const blocks = await fetchData(ROOM_BLOCKS_API_URL);
        if (!blocks || blocks.length === 0) {
            roomBlocksTableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No active room blocks.</td></tr>';
            return;
        }

        roomBlocksTableBody.innerHTML = '';
        blocks.forEach(block => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${block.roomNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateForDisplay(block.startDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateForDisplay(block.endDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${block.reason || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm delete-block-btn" data-id="${block._id}">Unblock</button>
                </td>
            `;
            roomBlocksTableBody.appendChild(row);
        });
        attachRoomBlockEventListeners();
    } catch (error) {
        console.error("Error fetching room blocks:", error);
        roomBlocksTableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load room blocks.</td></tr>';
    }
}

/** Attaches event listeners for room block actions. */
function attachRoomBlockEventListeners() {
    document.querySelectorAll('.delete-block-btn').forEach(button => {
        button.addEventListener('click', () => deleteRoomBlock(button.dataset.id));
    });
}

/** Handles submission of the room blocking form. */
if (roomBlockForm) {
    roomBlockForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const roomId = blockRoomSelect.value;
        const roomNumber = blockRoomSelect.options[blockRoomSelect.selectedIndex].textContent.split(' - ')[0]; // Extract room number
        const startDate = blockStartDateInput.value;
        const endDate = blockEndDateInput.value;
        const reason = blockReasonInput.value.trim();

        if (!roomId || !startDate || !endDate) {
            showMessage('Please select a room and valid dates.', 'error', 'block-message');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            showMessage('End date must be after start date.', 'error', 'block-message');
            return;
        }

        try {
            const response = await fetchData(ROOM_BLOCKS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room: roomId, roomNumber, startDate, endDate, reason }),
            });
            const data = await response.json();

            if (response.ok) {
                showMessage('Room blocked successfully!', 'success', 'block-message');
                roomBlockForm.reset();
                fetchRoomBlocks(); // Refresh blocks list
                // Re-fetch all rooms and bookings to update their availability
                fetchAllRooms();
                fetchBookings();
            } else {
                showMessage(data.message || 'Failed to block room. It might already be blocked or booked.', 'error', 'block-message');
            }
        } catch (error) {
            console.error('Error blocking room:', error);
            showMessage('Error blocking room. Please check your network or server.', 'error', 'block-message');
        }
    });
}

/** Handles deleting a room block (unblocking). */
async function deleteRoomBlock(id) {
    if (!confirm('Are you sure you want to unblock this room?')) return; // Consider a custom modal
    try {
        const response = await fetchData(`${ROOM_BLOCKS_API_URL}/${id}`, { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
            showMessage('Room unblocked successfully!', 'success', 'dashboard-message-area'); // General message
            fetchRoomBlocks(); // Refresh blocks list
            // Re-fetch all rooms and bookings to update their availability
            fetchAllRooms();
            fetchBookings();
        } else {
            showMessage(data.message || 'Failed to unblock room.', 'error', 'dashboard-message-area');
        }
    } catch (error) {
        console.error("Error unblocking room:", error);
        showMessage('Error unblocking room. Please check your network or server status.', 'error', 'dashboard-message-area');
    }
}


// --- Initial Load & Navigation ---

/** Main event listener for all menu items for section switching and data loading. */
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const targetSectionId = this.getAttribute('data-target');
        hideAllSections(); // Hide all sections first

        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden'); // Show the target section

            // Call specific fetch functions based on the target section
            if (targetSectionId === 'dashboard-section') {
                fetchDashboardSummary();
            } else if (targetSectionId === 'bookings-section') {
                fetchBookings();
                fetchAllRooms(); // Ensure rooms are loaded for the booking dropdowns
            } else if (targetSectionId === 'rooms-section') {
                fetchRooms();
                fetchAllRooms(); // Ensure allRooms is up-to-date for dashboard/other uses
            } else if (targetSectionId === 'room-blocking-section') {
                populateBlockRoomDropdown(); // Populate dropdown with all rooms
                fetchRoomBlocks(); // Fetch and display current blocks
            }
            // Add more conditions for other sections if needed

            // Close mobile sidebar if applicable
            closeSidebar();
        } else {
            console.error(`Target section with ID "${targetSectionId}" not found!`);
        }
    });
});

/** Initial setup on DOMContentLoaded. */
document.addEventListener('DOMContentLoaded', () => {
    // Mobile sidebar toggle listeners
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    // If the user is already "logged in" by some session state (e.g., after refresh),
    // ensure dashboard is shown and data loaded. Otherwise, the login form handles this.
    if (dashboardContent && !loginForm.classList.contains('hidden')) { // If dashboard-content is already visible (e.g. from a previous session)
        // No, this condition is wrong. This check is effectively saying "if dashboard is hidden and login is visible", which means not logged in.
        // The logic for initial load after actual login is in adminLoginForm.addEventListener
        // For a page refresh while "logged in" state, you'd check a token in localStorage/sessionStorage.
        // For this scenario, we assume the login process handles the first display.
    }
});
