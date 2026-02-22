const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    content: { type: String, required: true },
    downloadKey: { type: String, required: true },
    genre: { type: [String], required: true, default: [], trim: true },
    price: { type: Number, required: true, default: 0, min: 0 },
    like: { type: [String], required: true, default: [], trim: true },
    dislike: { type: Number, required: true, default: 0, min: 0 },
    media: {
        coverImage: { type: String, required: false },
        screenshots: { type: [String], required: false, default: [] },
        trailer: { type: String, required: false }
    },
    wishlist: { type: [String], required: true, default: [], trim: true },

});
module.exports = mongoose.model('Game', gameSchema);