const discountModel = require('../models/Discount');

exports.checkStopDiscount = async () => {
    try {
        const now = new Date();
        await discountModel.updateMany(
            {
                isActive: true,
                endDate: { $lt: now }
            },
            { $set: { isActive: false } }
        );
    } catch (err) {
        console.error('Error:', err);
    }
};

exports.checkStartDiscount = async () => {
    try {
        const now = new Date();
        await discountModel.updateMany(
            {
                isActive: false,
                startDate: { $lte: now },
                endDate: { $gt: now }
            },
            { $set: { isActive: true } }
        );
    } catch (err) {
        console.error('Error:', err);
    }
};