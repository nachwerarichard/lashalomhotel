<?php
$message = isset($_GET['message']) ? htmlspecialchars($_GET['message']) : 'No message available.';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Full viewport height */
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Light gray background */
        }
        .message-container {
            text-align: center;
            padding: 20px;
            border: 1px solid #ccc; /* Light gray border */
            border-radius: 8px; /* Rounded corners */
            background-color: #fff; /* White background for the message */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
        }
    </style>
</head>
<body>
    <div class="message-container">
        <p><?php echo $message; ?></p>
    </div>
</body>
</html>
