const discountModel = require('../models/Discount');

exports.checkDiscount = async () => {
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
}