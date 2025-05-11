<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Book Now</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center px-4">
  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
    <h1 class="text-2xl font-semibold text-center mb-6">Book Now</h1>

    <!-- Availability Check Section -->
    <div class="space-y-4 mb-6">
      <div>
        <label for="check-date" class="block text-sm font-medium text-gray-700">Check Date:</label>
        <input type="date" id="check-date" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <div>
        <label for="check-time" class="block text-sm font-medium text-gray-700">Check Time:</label>
        <input type="time" id="check-time" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <button type="button" id="check-availability-btn" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
        Check Availability
      </button>

      <div id="availability-message" class="text-center text-sm text-blue-600"></div>

      <button type="button" id="show-booking-form-btn" class="hidden w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">
        Book This Slot
      </button>
    </div>

    <!-- Booking Form Section -->
    <h2 id="book-now-title" class="text-xl font-semibold text-center mb-4 hidden">Complete Your Booking</h2>

    <form class="space-y-4 hidden" id="booking-form">
      <div>
        <label for="service" class="block text-sm font-medium text-gray-700">Select Service:</label>
        <select id="service" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="room">Room Booking</option>
          <option value="appointment">Appointment</option>
        </select>
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Select Date:</label>
        <input type="date" id="date" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <div>
        <label for="time" class="block text-sm font-medium text-gray-700">Select Time:</label>
        <input type="time" id="time" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Your Name:</label>
        <input type="text" id="name" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Your Email:</label>
        <input type="email" id="email" required class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
      </div>

      <button type="button" id="submit-booking-btn" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
        Submit Booking
      </button>

      <div id="message" class="hidden mt-4 text-sm text-center text-green-600"></div>
    </form>
  </div>

  <script src="script_01.js"></script>
</body>
</html>
