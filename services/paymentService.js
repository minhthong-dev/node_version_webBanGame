const PayOS = require('../config/payment');
const rawPaymentService = require('./rawPaymentService');

const createPaymentLink = async (amount, description, orderCode) => {
    const paymentLink = await PayOS.createPaymentLink(amount, description, orderCode);
    if (paymentLink) {
        await rawPaymentService.createRawPayment(paymentLink);
    }
    return paymentLink;
}
const verifyWebhookData = (data) => {
    return PayOS.verifyWebhook(data);
};
module.exports = { createPaymentLink, verifyWebhookData };