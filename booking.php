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
            <div>
            <p>Thank you for your booking. We shall get back to you shortly.</p>
            <p><a href='http://localhost/hotel_booking/lashalomhotel/cancel_booking.php?token=$cancellation_token'>Click here to cancel your booking</a></p>
            </div>
        </body>
        </html>
        ";
        $mail->send();
        echo ''
      ;
    } catch (Exception $e) {
        echo '<div style="color: red; font-weight: bold;">There was an error sending your booking: ' . htmlspecialchars($mail->ErrorInfo) . '</div>';
    }
} else {
    echo '<div style="color: red; font-weight: bold;">Invalid request method.</div>';
}
?>