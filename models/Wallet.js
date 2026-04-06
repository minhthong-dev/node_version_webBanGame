const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    stock: { 
        type: Number, 
        required: true,
        default: 0 
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WalletCategory',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
