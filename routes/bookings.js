const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticate } = require('../middleware/auth');

// Create a new booking
router.post('/book', authenticate, async (req, res) => {
    const { room_id, check_in_date, check_out_date } = req.body;
    const customer_id = req.user.userId;
    try {
        const newBooking = new Booking({ room_id, customer_id, check_in_date, check_out_date });
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create booking', details: err.message });
    }
});

module.exports = router;
