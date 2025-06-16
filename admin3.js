// --- Element References (Add these) ---
const roomBlockingSection = document.getElementById('room-blocking-section');
const roomBlockForm = document.getElementById('room-block-form');
const blockRoomSelect = document.getElementById('block-room-select');
const blockStartDateInput = document.getElementById('block-start-date');
const blockEndDateInput = document.getElementById('block-end-date');
const blockReasonInput = document.getElementById('block-reason');
const blockMessageDiv = document.getElementById('block-message');
const roomBlocksTableBody = document.querySelector('#room-blocks-table tbody');

const ROOM_BLOCKS_API_URL = 'https://bookingenginebackend.onrender.com/api/roomblocks'; // Define this URL
// --- END Element References ---


// --- NEW: Populate Block Room Dropdown ---
function populateBlockRoomDropdown(rooms) {
    if (!blockRoomSelect) return;
    blockRoomSelect.innerHTML = '<option value="">Select a room</option>';
    rooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true, sensitivity: 'base' }))
         .forEach(room => {
            const option = document.createElement('option');
            option.value = room._id;
            option.textContent = `${room.roomNumber} - ${room.roomType}`;
            blockRoomSelect.appendChild(option);
         });
}

// --- NEW: Fetch and Display Room Blocks ---
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

// --- NEW: Attach Event Listeners for Room Blocks ---
function attachRoomBlockEventListeners() {
    document.querySelectorAll('.delete-block-btn').forEach(button => {
        button.addEventListener('click', () => deleteRoomBlock(button.dataset.id));
    });
}

// --- NEW: Handle Room Block Form Submission ---
roomBlockForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const roomId = blockRoomSelect.value;
    const roomNumber = blockRoomSelect.options[blockRoomSelect.selectedIndex].textContent.split(' ')[0]; // Extract room number
    const startDate = blockStartDateInput.value;
    const endDate = blockEndDateInput.value;
    const reason = blockReasonInput.value.trim();

    if (!roomId || !startDate || !endDate) {
        showMessage('Please fill all required fields.', 'error', 'block-message');
        return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        showMessage('Start date cannot be after end date.', 'error', 'block-message');
        return;
    }

    try {
        const response = await fetch(ROOM_BLOCKS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room: roomId, roomNumber, startDate, endDate, reason }),
        });
        const data = await response.json();

        if (response.ok) {
            showMessage('Room blocked successfully!', 'success', 'block-message');
            roomBlockForm.reset();
            fetchRoomBlocks(); // Refresh blocks list
            // IMPORTANT: Re-fetch all rooms and bookings to update their availability
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

// --- NEW: Delete Room Block ---
async function deleteRoomBlock(id) {
    if (!confirm('Are you sure you want to unblock this room?')) return;
    try {
        const response = await fetch(`${ROOMS_API_URL}/${id}`, { method: 'DELETE' }); // Assuming /api/roomblocks/:id for DELETE
        const data = await response.json();

        if (response.ok) {
            showMessage('Room unblocked successfully!', 'success', 'block-message');
            fetchRoomBlocks(); // Refresh blocks list
            // IMPORTANT: Re-fetch all rooms and bookings to update their availability
            fetchAllRooms();
            fetchBookings();
        } else {
            showMessage(data.message || 'Failed to unblock room.', 'error', 'block-message');
        }
    } catch (error) {
        console.error("Error unblocking room:", error);
        showMessage('Error unblocking room. Please check your network or server status.', 'error', 'block-message');
    }
}


// --- Update your main menu item click handler in admin.js ---
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const targetSectionId = this.getAttribute('data-target');
        if (targetSectionId && document.getElementById(targetSectionId)) {
            // Your existing hideAllSections() and display:block logic here
            // Example:
            // document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
            // document.getElementById(targetSectionId).style.display = 'block';

            if (targetSectionId === 'dashboard-section') {
                fetchDashboardSummary();
            } else if (targetSectionId === 'bookings-section') {
                fetchBookings(); // Fetch bookings when this tab is clicked
                fetchAllRooms(); // Ensure rooms are available for the booking dropdown
            } else if (targetSectionId === 'rooms-section') {
                fetchRooms(); // Fetch rooms for the room management table
            } else if (targetSectionId === 'room-blocking-section') { // NEW
                fetchRoomBlocks(); // Fetch existing blocks
                populateBlockRoomDropdown(allRooms); // Populate room dropdown for blocking
            }
            // Add more conditions for other sections if needed

            // Close mobile sidebar if applicable
            // closeSidebar();
        }
    });
});

// --- Initial Data Loading on DOMContentLoaded (adjust as per your login flow) ---
document.addEventListener('DOMContentLoaded', () => {
    // This part depends on whether a user is logged in automatically or through a form.
    // If your admin-login-form handles showing dashboard-content:
    // Make sure your admin login success block calls these:
    // fetchAllRooms(); // Crucial to load all rooms for dropdowns
    // fetchBookings(); // For the initial dashboard view of bookings or if bookings is default
    // fetchRooms(); // If rooms management is also part of initial view
    // fetchDashboardSummary(); // For dashboard stats

    // If dashboard-content is visible initially (e.g. after a refresh with session):
    // if (document.getElementById('dashboard-content') && !document.getElementById('dashboard-content').classList.contains('hidden')) {
    //     fetchAllRooms(); // Crucial to load all rooms for dropdowns
    //     fetchBookings();
    //     fetchRooms();
    //     fetchDashboardSummary();
    // }
});
