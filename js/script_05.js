document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('http://localhost/hotel_booking/lashalomhtel/booking.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        this.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your booking.');
    });
});
