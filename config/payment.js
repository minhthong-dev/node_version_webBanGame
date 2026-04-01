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
    const paymentLink = await payOS.paymentRequests.create({
        amount: amount,
        description: description,
        orderCode: orderCode,
        returnUrl: 'http://localhost:3000/success',
        cancelUrl: 'http://localhost:3000/cancel',
    });
    return paymentLink;
}
const verifyWebhook = async (data) => {
    return payOS.webhooks.verify(data);
}
module.exports = { payOS, createPaymentLink, verifyWebhook };