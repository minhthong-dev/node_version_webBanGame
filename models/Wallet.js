const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: { // Giá bán VNĐ
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    idWalletCategory: { // Link bằng ObjectId tới WalletCategory
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WalletCategory',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
