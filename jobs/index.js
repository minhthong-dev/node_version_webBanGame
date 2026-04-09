const convertToUTC = (date = new Date()) => new Date(date).toISOString();


const cronjob = require('node-cron');
const checkVerifyToken = require('./checkVerifyToken');
const discountJob = require('./checkDiscount');

const fulfillPreOrders = require('./fulfillPreOrders');

const checkPaymentExpire = require('./checkPaymentExpire');
// Schedule the job to run 15 miniute
cronjob.schedule('* * * * *', () => {
    console.log('Running checkVerifyToken job every minute');
    checkVerifyToken.checkVerifyToken();
    discountJob.checkDiscountStatus();
    fulfillPreOrders.fulfillPreOrders();
    checkPaymentExpire.checkPaymentExpire();
    console.log('Cron job for checkVerifyToken has been scheduled, time now : ', convertToUTC());
});
