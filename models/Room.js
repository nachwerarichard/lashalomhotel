const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_id: { type: Number, required: true, unique: true },
    room_type: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

module.exports = mongoose.model('Room', roomSchema);
