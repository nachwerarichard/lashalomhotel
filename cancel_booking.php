<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if (isset($_GET['token'])) {
    $token = htmlspecialchars($_GET['token']);
    $filename = "bookings/{$token}.json";

    if (file_exists($filename)) {
        $booking = json_decode(file_get_contents($filename), true);

        if ($booking['status'] == 'confirmed') {
            // Update booking status
            $booking['status'] = 'cancelled';
            file_put_contents($filename, json_encode($booking));

            // Send cancellation email
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

                $mail->setFrom('nachwerarichard@gmail.com', 'Hotel Name'); // Replace with your email and hotel name
                $mail->addAddress($booking['email']); // Client's email
                $mail->addAddress('nachwerarichy@gmail.com'); // Additional recipient email

                // Content
                $mail->isHTML(true);
                $mail->Subject = "Booking Cancellation Confirmation";
                $mail->Body = "
                <html>
                <head>
                    <title>Booking Cancellation</title>
                </head>
                <body>
                    <h2>Your booking has been cancelled</h2>
                    <p>First Name: {$booking['fname']}</p>
                    <p>Last Name: {$booking['lname']}</p>
                    <p>Check-in Date: {$booking['checkin']}</p>
                    <p>Check-out Date: {$booking['checkout']}</p>
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
       <p>Your booking has been successfully cancelled.</p>
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
                    echo "There was an error sending the cancellation email: {$mail->ErrorInfo}";

    <script src="js/script.js"></script>
    <script src="js/script2.js"></script>
</body>
</html>';
            } catch (Exception $e) {
                echo '<!DOCTYPE html>
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
      <p>There was an error sending the cancellation email: {$mail->ErrorInfo}</p>    </div>
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
            echo '<!DOCTYPE html>
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
       <p>This booking is already cancelled</p>
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
        echo "Invalid cancellation token.";
    }
} else {
    echo "Invalid request.";
}
?>
