const mongoose = require('mongoose');

const walletCategorySchema = new mongoose.Schema({
    idWalletCategory: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('WalletCategory', walletCategorySchema);
