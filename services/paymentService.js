const PayOS = require('../config/payment');
const createPaymentLink = async (amount, description, orderCode) => {
    const paymentLink = await PayOS.createPaymentLink(amount, description, orderCode);
    return paymentLink;
}
const verifyWebhookData = (data) => {
    return PayOS.verifyPaymentWebhookData(data);
};
module.exports = { createPaymentLink, verifyWebhookData };