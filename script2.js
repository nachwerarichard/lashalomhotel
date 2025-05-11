let currentPage = 1;
const rowsPerPage = 4;
let bookingsData = [];

function renderTablePage(page) {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    bookingsTableBody.innerHTML = '';

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = bookingsData.slice(start, end);

    pageData.forEach(booking => {
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
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(bookingsData.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.margin = '0 5px';
        btn.disabled = i === currentPage;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderTablePage(currentPage);
            renderPagination();
        });
        paginationContainer.appendChild(btn);
    }
}
