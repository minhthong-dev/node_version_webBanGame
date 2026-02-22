const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    games: { type: [String], required: true, default: [], trim: true },
});

module.exports = mongoose.model('Cart', cartSchema);