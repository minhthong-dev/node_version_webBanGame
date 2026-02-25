const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    //code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    categoriesId: { type: [String], required: true, default: [], trim: true },
    gamesId: { type: [String], required: true, default: [], trim: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Discount', discountSchema);