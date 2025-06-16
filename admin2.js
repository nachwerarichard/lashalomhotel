// --- Existing Constants (keep these) ---
const API_BASE_URL = 'https://bookingenginebackend.onrender.com/api/bookings';
const ADMIN_LOGIN_URL = 'https://bookingenginebackend.onrender.com/api/admin/login';
const ROOMS_API_URL = 'https://bookingenginebackend.onrender.com/api/rooms'; // Or your local backend URL: 'http://localhost:5000/api/rooms'
// --- END Existing Constants ---

// --- NEW/UPDATED Element References ---
// Assuming these are the main content sections you want to toggle
const dashboardSection = document.getElementById('dashboard-section');
const bookingsSection = document.getElementById('bookings-section');
const roomsSection = document.getElementById('rooms-section');
const settingsSection = document.getElementById('settings-section'); // Make sure you have this section in HTML

const roomModal = document.getElementById('room-modal');
const roomForm = document.getElementById('room-form');
const roomIdInput = document.getElementById('room-id');
const roomModalTitle = document.getElementById('room-modal-title');
const roomMessageDiv = document.getElementById('room-message');

const deleteRoomModal = document.getElementById('delete-room-modal');
let deleteRoomId = null;

// References for mobile sidebar
const mobileSidebar = document.getElementById('mobile-sidebar');
const openSidebarBtn = document.getElementById('open-sidebar'); // Assuming you have a button to open it
const closeSidebarBtn = document.getElementById('close-sidebar');
// --- END NEW/UPDATED Element References ---

// --- Utility Functions (keep existing showMessage, fetchData) ---
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

// --- EXISTING Booking Management (no changes needed here initially) ---
// ... (your existing functions like fetchBookings, editBooking, handleEditSubmit, deleteBooking, showDeleteModal) ...
// ... (your existing event listeners for search, confirm/cancel delete booking, etc.) ...
// --- END EXISTING Booking Management ---


// --- Room Management Functions (keep these as they are from previous steps) ---
// ... fetchRooms() ...
// ... attachRoomEventListeners() ...
// ... editRoom(id) ...
// ... roomForm.addEventListener('submit', ...) ...
// ... document.getElementById('add-room-btn').addEventListener('click', ...) ...
// ... document.getElementById('cancel-room-btn').addEventListener('click', ...) ...
// ... showDeleteRoomModal(id) ...
// ... document.getElementById('cancel-delete-room-btn').addEventListener('click', ...) ...
// ... document.getElementById('confirm-delete-room-btn').addEventListener('click', ...) ...
// --- END Room Management Functions ---


// --- Dashboard Summary Function (keep this) ---
async function fetchDashboardSummary() {
    try {
        const rooms = await fetchData(ROOMS_API_URL);
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room.status === 'Available').length;

        document.getElementById('total-rooms').textContent = totalRooms;
        document.getElementById('available-rooms').textContent = availableRooms;

    } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
    }
}
// --- END Dashboard Summary Function ---


// --- UPDATED: Centralized Section Switching Logic ---

// Function to hide all main content sections
function hideAllSections() {
    // Ensure you have references to all your section elements
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (bookingsSection) bookingsSection.style.display = 'none';
    if (roomsSection) roomsSection.style.display = 'none';
    if (settingsSection) settingsSection.style.display = 'none';
    // Add other section references here as they are created
}

// Function to open the mobile sidebar
function openSidebar() {
    if (mobileSidebar) {
        mobileSidebar.classList.remove('-translate-x-full');
    }
}

// Function to close the mobile sidebar
function closeSidebar() {
    if (mobileSidebar) {
        mobileSidebar.classList.add('-translate-x-full');
    }
}

// Main event listener for all menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const targetSectionId = this.getAttribute('data-target');
        if (targetSectionId) {
            hideAllSections(); // Hide all sections first

            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block'; // Show the target section

                // Call specific fetch functions based on the target section
                if (targetSectionId === 'dashboard-section') {
                    fetchDashboardSummary();
                } else if (targetSectionId === 'bookings-section') {
                    fetchBookings();
                } else if (targetSectionId === 'rooms-section') {
                    fetchRooms();
                }
                // Add more conditions for other sections if needed (e.g., settings, inventory)

                closeSidebar(); // Close sidebar after selection, especially for mobile
            } else {
                console.error(`Target section with ID "${targetSectionId}" not found!`);
            }
        } else if (this.id === 'logout-btn-mobile') {
            // Handle logout specifically if it's not tied to a data-target
            handleLogout(); // Assuming you have a handleLogout function
            closeSidebar();
        }
    });
});

// --- END UPDATED: Centralized Section Switching Logic ---


// --- EXISTING Admin Login (ensure this calls fetchRooms and fetchDashboardSummary after successful login) ---
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

            // After successful login, default to showing the dashboard
            hideAllSections();
            dashboardSection.style.display = 'block';

            // Initial data fetches for the dashboard
            fetchBookings();
            fetchRooms();
            fetchDashboardSummary();

            // Potentially show a "Toast" success message for login
            // showMessage('Login successful!', 'success', 'login-message');

        } else {
            showMessage(data.message || 'Login failed.', 'error', 'login-message');
        }
    } catch (err) {
        showMessage('Network error during login.', 'error', 'login-message');
    }
});
// --- END Existing Admin Login ---

// --- EXISTING Logout Function (make sure it's defined) ---
function handleLogout() {
    // Clear any login tokens/session info
    // Redirect to login page or hide dashboard and show login form
    document.getElementById('dashboard-content').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    console.log("Logged out successfully!");
    // You might want to clear form fields as well
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}
// --- END EXISTING Logout Function ---

// --- Mobile Sidebar Toggle Listeners ---
// You will need a button in your main header/content area to open the sidebar on mobile
if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', openSidebar);
}
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
}
// --- END Mobile Sidebar Toggle Listeners ---


// --- Initial Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // If the dashboard-content is meant to be visible by default for logged-in users
    // (e.g., if you're managing session state), then uncomment these:
    // if (document.getElementById('dashboard-content') && !document.getElementById('dashboard-content').classList.contains('hidden')) {
    //     hideAllSections();
    //     dashboardSection.style.display = 'block';
    //     fetchBookings();
    //     fetchRooms();
    //     fetchDashboardSummary();
    // }
    // Otherwise, the admin login success block handles the initial display and data fetching.
});
