const mongoose = require('mongoose');

const rawPaymentSchema = new mongoose.Schema({
    bin: String,
    accountNumber: String,
    accountName: String,
    amount: Number,
    description: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderCode: { type: Number, unique: true },
    currency: String,
    paymentLinkId: String,
    status: { type: String, default: 'PENDING' },
    expiredAt: { type: Date, default: null },
    checkoutUrl: String,
    qrCode: String
}, { timestamps: true });

module.exports = mongoose.model('RawPayment', rawPaymentSchema);
