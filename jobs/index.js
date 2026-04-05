const convertToUTC = (date = new Date()) => new Date(date).toISOString();


const cronjob = require('node-cron');
const checkVerifyToken = require('./checkVerifyToken');
const checkDiscount = require('./checkDiscount');
const fulfillPreOrders = require('./fulfillPreOrders');

cronjob.schedule('* * * * *', () => {
    console.log('Running checkVerifyToken job every minute');
    checkVerifyToken.checkVerifyToken();
    checkDiscount.checkDiscount();
    fulfillPreOrders.fulfillPreOrders();
    console.log('Cron job for checkVerifyToken has been scheduled, time now : ', convertToUTC());
});
