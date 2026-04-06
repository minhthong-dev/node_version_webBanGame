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

const cancelPayment = async (paymentLinkId, orderCode) => {
    const paymentLink = await PayOS.cancelPayment(orderCode);
    try {
        if (paymentLink) {
            await rawPaymentService.updateRawPaymentStatus(paymentLinkId, 'CANCEL');
        }
        return paymentLink;
    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports = { createPaymentLink, verifyWebhookData, cancelPayment };