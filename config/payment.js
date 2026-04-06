//const express = require('express');
const { PayOS } = require('@payos/node');
const dotenv = require('dotenv');
dotenv.config();
console.log("client id: ", process.env.BANK_CLIENT_ID, "api key: ", process.env.BANK_API_KEY, "checksum key: ", process.env.BANK_CHEKSUM_KEY);

//An lai de test
/*
const payOS = new PayOS({
    clientId: process.env.BANK_CLIENT_ID,
    apiKey: process.env.BANK_API_KEY,
    checksumKey: process.env.BANK_CHEKSUM_KEY,
});
*/
//Object fake de khong bi crash (line 15 - 18)
const payOS = {
    createPaymentLink: () => { console.log("PayOS is disabled"); return { checkoutUrl: '#' }; }
}

const createPaymentLink = async (amount, description, orderCode) => {
    const url = process.env.BACKEND_URL;
    const paymentLink = await payOS.paymentRequests.create({
        amount: amount,
        description: description,
        orderCode: orderCode,
        returnUrl: `${url}/api/payos/success`,
        cancelUrl: `${url}/api/payos/cancel`,
    });
    return paymentLink;
}

const cancelPayment = async (orderCode) => {
    const paymentLink = await payOS.paymentRequests.cancel(orderCode, "hết hạn roi,hehee con chos");
    return paymentLink;
}
const verifyWebhook = async (data) => {
    return payOS.webhooks.verify(data);
}
module.exports = { payOS, createPaymentLink, verifyWebhook, cancelPayment };