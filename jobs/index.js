const cronjob = require('node-cron');
const checkVerifyToken = require('./checkVerifyToken');

// Schedule the job to run 15 miniute
cronjob.schedule('15 * * * *', () => {
    console.log('Running checkVerifyToken job every minute');
    checkVerifyToken.checkVerifyToken();
});

console.log('Cron job for checkVerifyToken has been scheduled.');