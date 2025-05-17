window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('book-now-btn').addEventListener('click', submitBooking);
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('check-availability-btn').addEventListener('click', checkAvailability);
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('check-availability-btn').addEventListener('click', checkAvailability);
  document.getElementById('show-booking-form-btn').addEventListener('click', showBookingForm);
  document.getElementById('book-now-btn').addEventListener('click', submitBooking);
});

/*function checkAvailability() {
  const date = document.getElementById('check-date').value;
  const time = document.getElementById('check-time').value;
  const messageDiv = document.getElementById('availability-message');

  if (date && time) {
    // Simulated availability response
    messageDiv.innerHTML = `<p class="success">Slot available for ${date} at ${time}!</p>`;

    // Show 'Book Now' button
    const bookNowBtn = document.getElementById('book-now-btn');
    bookNowBtn.classList.remove('hidden');

    // Store selected values for booking form
    bookNowBtn.dataset.date = date;
    bookNowBtn.dataset.time = time;
  } else {
    messageDiv.innerHTML = `<p class="error">Please select both date and time.</p>`;
  }
}
*/
function showBookingForm() {
  const btn = document.getElementById('show-booking-form-btn');
  const date = btn.dataset.date;
  const time = btn.dataset.time;

  // Auto-fill booking form with selected date/time
  document.getElementById('date').value = date;
  document.getElementById('time').value = time;

  // Show form and title
  document.getElementById('booking-form').classList.remove('hidden');
  document.getElementById('book-now-title').classList.remove('hidden');

  // Hide the 'Book Now' button
  btn.classList.add('hidden');
}

async function submitBooking() {
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');

  const bookingData = { service, date, time, name, email };

  try {
    const response = await fetch('https://bookingenginebackend.onrender.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.className = 'success';
      messageDiv.textContent = data.message;
      messageDiv.classList.remove('hidden');
      document.getElementById('booking-form').reset();
      setTimeout(() => messageDiv.classList.add('hidden'), 3000);
    } else {
      messageDiv.className = 'error';
      messageDiv.textContent = data.error || 'An error occurred.';
      messageDiv.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    messageDiv.className = 'error';
    messageDiv.textContent = 'Failed to submit booking.';
    messageDiv.classList.remove('hidden');
  }
}
