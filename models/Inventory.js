const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
        unique: true,
        index: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    reserved: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, { timestamps: true });

inventorySchema.virtual('available').get(function () {
    return this.stock - this.reserved;
});

module.exports = mongoose.model('Inventory', inventorySchema);
