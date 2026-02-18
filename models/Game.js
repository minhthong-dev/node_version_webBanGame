const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name : { type: String, required: true },
    releaseDate : { type: Date, required: true },
    content : { type: String, required: true },
    downloadKey : { type: String, required: true },
    genre : { type: [String], required: true, default: [], trim: true },
    price : { type: Number, required: true, default: 0, min: 0 },
    like : { type: Number, required: true, default: 0, min: 0 },
    dislike : { type: Number, required: true, default: 0, min: 0 },
    media : {
        coverImage : { type: String, required: true },
        screenshots : { type: [String], required: true, default: [] },
        trailer : { type: String, required: true }
    },
});
module.exports = mongoose.model('Game', gameSchema);