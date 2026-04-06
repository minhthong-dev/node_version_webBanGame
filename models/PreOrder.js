const mongoose = require('mongoose');

const preOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    priceLocked: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        enum: ['out_of_stock', 'unreleased'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    fulfilledAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

preOrderSchema.index({ userId: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model('PreOrder', preOrderSchema);
