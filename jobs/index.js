const convertToUTC = (date = new Date()) => new Date(date).toISOString();


const cronjob = require('node-cron');
const checkVerifyToken = require('./checkVerifyToken');
const checkDiscount = require('./checkDiscount');

cronjob.schedule('* * * * *', () => {
    console.log('Running checkVerifyToken job every minute');
    checkVerifyToken.checkVerifyToken();
    checkDiscount.checkDiscount();
    console.log('Cron job for checkVerifyToken has been scheduled, time now : ', convertToUTC());
});
