const PayOS = require('../config/payment');
const createPaymentLink = async (amount, description, orderCode) => {
    const paymentLink = await PayOS.createPaymentLink(amount, description, orderCode);
    return paymentLink;
}
module.exports = { createPaymentLink };