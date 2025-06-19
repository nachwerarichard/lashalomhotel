
      
// Function to show the loading spinner
function showSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

// Function to hide the loading spinner
function hideSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
}

// Function to show the success modal
function showSuccessModal(message) {
    const successModal = document.getElementById('success-modal');
    const successMessageText = document.getElementById('success-message-text');

    successMessageText.textContent = message;
    successModal.classList.remove('hidden');
}

// Function to hide the success modal
function hideSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Attach event listener to the "Okay" button in the success modal to close it.
document.addEventListener('DOMContentLoaded', () => {
    const okayButton = document.querySelector('#success-modal button'); // Select the button within the modal.
    if (okayButton) {
        okayButton.addEventListener('click', hideSuccessModal);
    }
});

document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the spinner before starting the operation
    showSpinner();

    // Simulate an asynchronous operation (replace with your actual save logic)
    setTimeout(function() {
        // Hide the spinner when the operation is complete
        hideSpinner();

        // Show the success modal with a message
        showSuccessModal('Booking details updated successfully!');

        //  You might choose to hide the edit form here, or after the user closes the success modal.
        //  document.getElementById('edit-booking-form').classList.add('hidden');

    }, 2000); // Simulate a 2-second saving process
});
    
 
    
    const loginForm = document.getElementById("admin-login-form");
    const dashboardContent = document.getElementById("dashboard-content");
    const loginFormContainer = document.getElementById("login-form");

    const hamburgerBtn = document.getElementById("hamburger-btn");
    const mobileSidebar = document.getElementById("mobile-sidebar");
    const closeSidebar = document.getElementById("close-sidebar");

    const menuItems = document.querySelectorAll('.menu-item');
    const sections = ["dashboard-section", "bookings-section", "settings-section","rooms-section"];

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      dashboardContent.classList.remove("hidden");
      loginFormContainer.classList.add("hidden");
    });

    hamburgerBtn.addEventListener("click", () => {
      mobileSidebar.classList.remove("-translate-x-full");
    });

    closeSidebar.addEventListener("click", () => {
      mobileSidebar.classList.add("-translate-x-full");
    });

    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetId = item.getAttribute("data-target");
        if (targetId) {
          sections.forEach(id => {
            document.getElementById(id).classList.add("hidden");
          });
          document.getElementById(targetId).classList.remove("hidden");
        }
        mobileSidebar.classList.add("-translate-x-full"); // Close on mobile
      });
    });

    // Optional logout functionality placeholder
    document.getElementById("logout-btn").addEventListener("click", () => {
         dashboardContent.classList.add('hidden');
         loginFormContainer.classList.remove('hidden');    });
    document.getElementById("logout-btn-mobile").addEventListener("click", () => {
           dashboardContent.classList.add('hidden');
         loginFormContainer.classList.remove('hidden');      });
  
const createBookingModal = document.getElementById("create-booking-modal");
const closeCreateModal = document.getElementById("close-create-modal");
const createForm = document.getElementById("create-form");
const createMessage = document.getElementById("create-message");
const createBookingButton = document.getElementById("create-booking-button");

const successModal = document.getElementById("booking_success_modal");
const closeSuccessModal = document.getElementById("close-success-modal");
const successMessageText = document.getElementById("success-message-text");

closeCreateModal.addEventListener("click", () => {
  createBookingModal.classList.add("hidden");
});

window.addEventListener("click", (event) => {
  if (event.target === createBookingModal) {
    createBookingModal.classList.add("hidden");
  }
});

closeSuccessModal.addEventListener("click", () => {
  successModal.classList.add("hidden");
});
closeSuccessModal.addEventListener("click", () => {
  createBookingModal.style.display="none";
});
window.addEventListener("click", (event) => {
  if (event.target === successModal) {
    successModal.classList.add("hidden");
  }
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Disable the button and change the text.
  createBookingButton.disabled = true;
  createBookingButton.innerHTML = `<span class="loader"></span><span class="loader-text">Processing...</span>`;
  createMessage.classList.add("hidden"); // Ensure message is hidden

  // Simulate an asynchronous operation (e.g., an API call) using a Promise.
  const simulatedRequest = new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful response after 2 seconds
      const response = { success: true, message: "Booking created successfully!" };
      resolve(response);
      // Simulate an error response (for testing)
      // const response = { success: false, message: "Failed to create booking." };
      // resolve(response);
    }, 2000);
  });

  simulatedRequest
    .then((response) => {
      if (response.success) {
        // Display the success message in the modal.
        successMessageText.textContent = response.message;
        successModal.classList.remove("hidden");
        createBookingModal.classList.add("hidden"); // Hide the form modal
        createForm.reset(); // Clear the form
      } else {
        createMessage.textContent = response.message;
        createMessage.classList.remove("hidden");
      }
    })
    .catch((error) => {
      // Handle errors (e.g., network issues)
      createMessage.textContent = "An error occurred. Please try again later.";
      createMessage.classList.remove("hidden");
    })
    .finally(() => {
      // Re-enable the button and restore the original text.
      createBookingButton.disabled = false;
      createBookingButton.innerHTML = "Create Booking";
    });
});

  document.addEventListener('DOMContentLoaded', function() {
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteModal = document.getElementById('delete-modal');
    const successModal = document.getElementById('success-modal');

    // Function to hide the delete modal
    function hideDeleteModal() {
        deleteModal.classList.add('hidden');
    }

    // Function to show the success modal
    function showSuccessModal() {
        successModal.classList.remove('hidden');
    }

    // Event listener for the "Yes" button in the delete modal
    confirmDeleteBtn.addEventListener('click', function() {
        // In a real application, you would perform the actual deletion here.
        console.log('Deletion confirmed!');

        // Hide the delete modal
        hideDeleteModal();

        // Show the success modal
        showSuccessModal();
    });
});

    document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const targetId = this.dataset.target;

        // Hide all content sections
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('bookings-section').classList.add('hidden');
        document.getElementById('rooms-section').classList.add('hidden'); // Added this line
        document.getElementById('settings-section').classList.add('hidden');

        // Show the targeted section
        document.getElementById(targetId).classList.remove('hidden');

        // Close mobile sidebar if open
        const mobileSidebar = document.getElementById('mobile-sidebar');
        if (!mobileSidebar.classList.contains('-translate-x-full')) {
            mobileSidebar.classList.add('-translate-x-full');
        }
    });
});

// Initial display (e.g., show dashboard on load)
// document.getElementById('dashboard-section').classList.remove('hidden'); // Or whichever section you want to show by default
