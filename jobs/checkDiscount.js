const discountModel = require('../models/Discount');

exports.checkStopDiscount = async () => {
    try {
        const now = new Date();
        console.log('now: ', now.toISOString());
        const discounts = await discountModel.find({
            isActive: true,
            endDate: { $lt: now }
        });
        console.log(`Found ${discounts.length} discounts (expired).`);
        if (discounts.length > 0) {
            const discountIds = discounts.map(discount => discount._id);
            const result = await discountModel.updateMany({
                _id: { $in: discountIds }
            }, {
                isActive: false
            });
            console.log(`Updated ${result.modifiedCount} discounts (expired).`);
        }
    } catch (err) {
        console.error('Error updating expired discounts:', err);
    }
},
exports.checkStartDiscount = async () => {
    try {
        const now = new Date();
        console.log('now: ', now.toISOString());
        const discounts = await discountModel.find({
            isActive: false,
            startDate: { $lte: now }
        });
        console.log(`Found ${discounts.length} discounts (ready to start).`);
        if (discounts.length > 0) {
            const discountIds = discounts.map(discount => discount._id);
            const result = await discountModel.updateMany({
                _id: { $in: discountIds }
            }, {
                isActive: true
            });
            console.log(`Updated ${result.modifiedCount} discounts (started).`);
        }
    } catch (err) {
        return console.error('Error updating start discounts:', err);
    }
}