const discountModel = require('../models/Discount');

exports.checkDiscountStatus = async () => {
    try {
        const now = new Date();
        const bulkOps = [
            {
                updateMany: {
                    filter: {
                        isActive: true,
                        endDate: { $lt: now }
                    },
                    update: { $set: { isActive: false } }
                }
            },
            {
                updateMany: {
                    filter: {
                        isActive: false,
                        startDate: { $lte: now },
                        endDate: { $gt: now }
                    },
                    update: { $set: { isActive: true } }
                }
            }
        ];
        
        await discountModel.bulkWrite(bulkOps);
    } catch (err) {
        console.error('Error:', err);
    }
};