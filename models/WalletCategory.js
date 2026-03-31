const mongoose = require('mongoose');

const walletCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('WalletCategory', walletCategorySchema);
