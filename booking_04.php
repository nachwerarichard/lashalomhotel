<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = htmlspecialchars($_POST['fname']);
    $lname = htmlspecialchars($_POST['lname']);
    $email = htmlspecialchars($_POST['email']);
    $number = htmlspecialchars($_POST['phone']);
    $checkin = htmlspecialchars($_POST['checkin']);
    $checkout = htmlspecialchars($_POST['checkout']);
    $location = htmlspecialchars($_POST['location']);
    $rlocation = htmlspecialchars($_POST['rlocation']);
    $message = htmlspecialchars($_POST['requests']);

    // Generate a unique token
    $cancellation_token = bin2hex(random_bytes(16));
    $directory = "bookings";

    // Create the bookings directory if it doesn't exist
    if (!is_dir($directory)) {
        mkdir($directory, 0777, true);
    }

    $filename = "$directory/{$cancellation_token}.json";

    // Store booking details in a file
    $booking_details = [
        'fname' => $fname,
        'lname' => $lname,
        'email' => $email,
        'phone' => $number,
        'checkin' => $checkin,
        'checkout' => $checkout,
        'location' => $location,
        'rlocation' => $rlocation,
        'requests' => $message,
        'status' => 'confirmed'
    ];
    file_put_contents($filename, json_encode($booking_details));

     // Send booking confirmation email with cancellation link
     
    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'nachwerarichard@gmail.com'; // Replace with your Gmail address
        $mail->Password = 'zwdx qwwc yyux pkhq'; // Replace with your Gmail password or App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        //Recipients
        $mail->setFrom($email, $fname);
        $mail->addAddress('nachwerarichy@gmail.com'); // Replace with your hotel email

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Booking from $fname";
        $mail->Body = "
        <html>
        <head>
            <title>New Booking</title>
        </head>
        <body>
            <h2>Booking Details</h2>
            <p><strong>First Name:</strong> $fname</p>
            <p><strong>Last Name:</strong> $lname</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Number:</strong> $number</p>
            <p><strong>Check-in Date:</strong> $checkin</p>
            <p><strong>Check-out Date:</strong> $checkout</p>
            <p><strong>Room Type:</strong> $location</p>
            <p><strong>Room Location:</strong> $rlocation</p>
            <p><strong>Special Requests:</strong> $message</p>
        </body>
        </html>
        ";
        $mail->send();
        echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="shortcut icon" type="image/x-icon" href="hotelpics/svg/icon01.png" />
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/modal.css">
    <link rel="stylesheet" href="css/styles03.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
</head>
<body>
    <div id="loader" class="loader"></div>
    <div id="content" style="display: none;">
        <nav class="navbar">
            <div class="logo">Hotel</div>
            <div class="nav-links" id="navLinks">
                <a href="home.html">Home</a>
                <a href="rooms.html">Accommodation</a>
                <a href="dining.html" >Wine&Dine</a>
                <a href="health.html">Health&SPA</a>
                <a href="experience.html">Attractions</a>
                <a ></a>
                <div class="dropdown">
                    <a href="#more" class="dropbtn">More <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <a href="about.html">About Us</a>
                    <a href="gallery.html">Gallery</a>
                    <a href="contact.html">Contact Us</a>
                    <a href="careers.html" class="active">Careers</a>
                    </div>
                </div>
            </div>
            <div class="hamburger" id="hamburger">
                <div class="bar bar1"></div>
                <div class="bar bar2"></div>
                <div class="bar bar3"></div>
            </div>
        </nav>
    <div class="hotel-info">
            <p>Thank you for your booking. We shall get back to you shortly.</p>
            <p><a href="http://localhost/hotel_booking/lashalomhotel/cancel_booking.php?token=$cancellation_token">Click here to cancel your booking</a></p>
             <button id="openModalBtn">Open Modal</button>

        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <p>Are you sure you want to proceed?</p>
            <button id="cancelBtn">Cancel</button>
            <button id="okBtn">OK</button>
          </div>
        </div>
    </div>
    <div class="whatsapp-float">
        <a href="https://api.whatsapp.com/send?phone=1234567890" target="_blank" rel="noopener noreferrer">
          <img src="hotelpics/svg/vecteezy_whatsapp-logo-png-whatsapp-icon-png-whatsapp-transparent_18930748.png" alt="WhatsApp">
        </a>
      </div>
      <div class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <h4>Contact Us</h4>
                <p>Mbale City</p>
                <p>Email: info@richyhotel.com</p>
                <p>Phone: +256 706732078</p>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <ul>
                    <li> <a href="https://twitter.com/HeritanceHotels"><img src="twitter-icon.png" alt="">Twitter</a></li>
                   <li> <a href="https://www.facebook.com/SrilankanHotels/"><img src="facebook-icon.png" alt="">Facebook</a></li>
                    <li><a href="https://www.instagram.com/srilanka.hotels/"><img src="instagram-icon.png" alt="">Instagram</a></li>
                    <li><a href="https://lk.linkedin.com/company/cinnamon-hotels-resorts"><img src="linkedin-icon.png" alt="">LinkedIn</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="home.html">Home</a></li>
                    <li><a href="rooms.html">Accommodation</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Hotel. All rights reserved.</p>
        </div>
    </div>
    </div> 
    <script src="js/script.js"></script>
    <script src="js/script2.js"></script>
    <script src="js/script3.js"></script>
</body>
</html>'
      ;
    } catch (Exception $e) {
        echo '
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="shortcut icon" type="image/x-icon" href="hotelpics/svg/icon01.png" />
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/styles03.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
</head>
<body>
    <div id="loader" class="loader"></div>
    <div id="content" style="display: none;">
        <nav class="navbar">
            <div class="logo">Hotel</div>
            <div class="nav-links" id="navLinks">
                <a href="home.html">Home</a>
                <a href="rooms.html">Accommodation</a>
                <a href="dining.html" >Wine&Dine</a>
                <a href="health.html">Health&SPA</a>
                <a href="experience.html">Attractions</a>
                <a ></a>
                <div class="dropdown">
                    <a href="#more" class="dropbtn">More <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <a href="about.html">About Us</a>
                    <a href="gallery.html">Gallery</a>
                    <a href="contact.html">Contact Us</a>
                    <a href="careers.html" class="active">Careers</a>
                    </div>
                </div>
            </div>
            <div class="hamburger" id="hamburger">
                <div class="bar bar1"></div>
                <div class="bar bar2"></div>
                <div class="bar bar3"></div>
            </div>
        </nav>
   
    <div class="hotel-info">
        <div style="color: red; font-weight: bold;">There was an error sending your booking: ' . htmlspecialchars($mail->ErrorInfo) . '</div>
    </div>
    <div class="whatsapp-float">
        <a href="https://api.whatsapp.com/send?phone=1234567890" target="_blank" rel="noopener noreferrer">
          <img src="hotelpics/svg/vecteezy_whatsapp-logo-png-whatsapp-icon-png-whatsapp-transparent_18930748.png" alt="WhatsApp">
        </a>
      </div>
      <div class="footer">
        <div class="footer-container">
            <div class="footer-section">
                <h4>Contact Us</h4>
                <p>Mbale City</p>
                <p>Email: info@richyhotel.com</p>
                <p>Phone: +256 706732078</p>
            </div>
            <div class="footer-section">
                <h4>Follow Us</h4>
                <ul>
                    <li> <a href="https://twitter.com/HeritanceHotels"><img src="twitter-icon.png" alt="">Twitter</a></li>
                   <li> <a href="https://www.facebook.com/SrilankanHotels/"><img src="facebook-icon.png" alt="">Facebook</a></li>
                    <li><a href="https://www.instagram.com/srilanka.hotels/"><img src="instagram-icon.png" alt="">Instagram</a></li>
                    <li><a href="https://lk.linkedin.com/company/cinnamon-hotels-resorts"><img src="linkedin-icon.png" alt="">LinkedIn</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="home.html">Home</a></li>
                    <li><a href="rooms.html">Accommodation</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Hotel. All rights reserved.</p>
        </div>
    </div>
    </div> 
    <script src="js/script.js"></script>
    <script src="js/script2.js"></script>
</body>
</html>';
    }
} else {
    echo '<div style="color: red; font-weight: bold;">Invalid request method.</div>';
}
?>