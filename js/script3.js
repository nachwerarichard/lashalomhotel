
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the cancel button
var cancelBtn = document.getElementById("cancelBtn");

// Get the OK button
var okBtn = document.getElementById("okBtn");

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks on the cancel button, close the modal
cancelBtn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks on the OK button, close the modal
okBtn.onclick = function() {
    location.href = 'http://localhost/hotel_booking/lashalomhotel/cancel_booking.php?token=$cancellation_token';
    modal.style.display = "none";
    window.style.display="none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}