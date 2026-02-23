const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    games: { type: [String], required: true, default: [], trim: true },
});

const historyModel = mongoose.model('History', historySchema);