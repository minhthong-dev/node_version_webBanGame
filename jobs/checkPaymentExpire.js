const RawPayment = require('../models/RawPayment');
const paymentService = require('../services/paymentService');
exports.checkPaymentExpire = async () => {
    try {
        const now = new Date();
        const expirationTime = new Date(Date.now() - 1 * 60 * 1000);
        console.log('now: ', now.toISOString());
        const payments = await RawPayment.find({
            status: 'PENDING',
            createdAt: { $lt: expirationTime }
        });
        console.log(`Found ${payments.length} pending payments (expired).`);
        if (payments.length > 0) {
            const result = await Promise.all(payments.map(async (payment) => {
                return await paymentService.cancelPayment(payment.paymentLinkId, payment.orderCode);
            }));
            console.log(`Deleted ${result.length} pending payments (expired).`);
        }
    } catch (err) {
        console.error('Error deleting expired pending payments:', err);
    }
}