<?php
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

$mail = new PHPMailer\PHPMailer\PHPMailer();

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'nachwerarichard@gmail.com';
$mail->Password = 'zwdx qwwc yyux pkhq'; // Use your App Password
$mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;

$mail->setFrom('nachwerarichard@gmail.com', 'Test');
$mail->addAddress('nachwerarichy@gmail.com');

$mail->isHTML(true);
$mail->Subject = 'SMTP Test';
$mail->Body = 'This is a test email.';

if ($mail->send()) {
    echo 'Mail sent successfully.';
} else {
    echo 'Mail failed: ' . $mail->ErrorInfo;
}
<div class='hotel-info'>
            <p>Thank you for your booking. We shall get back to you shortly.</p>
            <p><a href='http://localhost/hotel_booking/lashalomhotel/cancel_booking.php?token=$cancellation_token'>Click here to cancel your booking</a></p>
        </div>
        There was an error sending your booking: ' . htmlspecialchars($mail->ErrorInfo) . '</div>'

        D29JQ6KEC62M4348GNHRZMA1