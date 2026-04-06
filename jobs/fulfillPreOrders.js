const preOrderService = require('../services/preOrderService');

const fulfillPreOrders = async () => {
    try {
        const count = await preOrderService.fulfillEligiblePreOrders();
        if (count > 0) {
            console.log(`[PreOrder] Fulfilled ${count} pre-order(s)`);
        }
    } catch (error) {
        console.error('[PreOrder] fulfillPreOrders job error:', error);
    }
};

module.exports = { fulfillPreOrders };
