const mongoose = require('mongoose');

// Đơn đặt chờ thanh toán (giữ hàng 15 phút)
const reservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['actived', 'completed', 'expired', 'transfered'],
        default: 'actived',
        index: true
    },
    expiredIn: {
        type: Date,
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
