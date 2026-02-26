const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    type: {
        type: String,
        enum: ['amount', 'buying'],
        required: true
    },
    totalValue: {
        type: Number,
        required: true
    },
    gameIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'games',
        required: function () { return this.type === 'buying'; }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isHide: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);