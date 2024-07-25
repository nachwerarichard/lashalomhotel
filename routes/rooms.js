const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { authenticate, isAdmin } = require('../middleware/auth');

// Add a new room (Admin only)
router.post('/add', authenticate, isAdmin, async (req, res) => {
    const { room_id, room_type, capacity, price, description } = req.body;
    try {
        const newRoom = new Room({ room_id, room_type, capacity, price, description });
        await newRoom.save();
        res.status(201).json({ message: 'Room added successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to add room', details: err.message });
    }
});

// Check room availability
router.post('/check-availability', async (req, res) => {
    const { checkInDate, checkOutDate, roomType } = req.body;
    try {
        const availableRooms = await Room.aggregate([
            { $match: { room_type: roomType } },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'room_id',
                    as: 'bookings'
                }
            },
            {
                $match: {
                    $or: [
                        { 'bookings': { $eq: [] } },
                        {
                            'bookings': {
                                $not: {
                                    $elemMatch: {
                                        status: 'confirmed',
                                        $or: [
                                            { check_in_date: { $lte: new Date(checkOutDate) }, check_out_date: { $gte: new Date(checkInDate) } }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    room_id: 1,
                    room_type: 1,
                    capacity: 1,
                    price: 1,
                    description: 1
                }
            }
        ]).toArray();

        if (availableRooms.length > 0) {
            res.status(200).json({ availableRooms });
        } else {
            res.status(404).json({ message: 'No rooms available for the selected dates.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
