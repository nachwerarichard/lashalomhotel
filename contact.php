<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $number = htmlspecialchars($_POST['phone']);
    $message = htmlspecialchars($_POST['message']);
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
        $mail->setFrom($email, $name);
        $mail->addAddress('nachwerarichy@gmail.com'); // Replace with your hotel email

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Booking from $name";
        $mail->Body = "
        <html>
        <head>
            <title>New Booking</title>
        </head>
        <body>
            <h2>Booking Details</h2>
            <p><strong>First Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Number:</strong> $number</p>
            <p><strong>Special Requests:</strong> $message</p>
        </body>
        </html>
        ";
        $mail->send();
        echo "Thank you for your message. ";
    } catch (Exception $e) {
        echo "There was an error sending your booking: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request method.";
}
?>