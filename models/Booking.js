const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    status: { type: String, default: 'confirmed' }
});

module.exports = mongoose.model('Booking', bookingSchema);
