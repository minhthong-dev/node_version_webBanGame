const cronjob = require('node-cron');
const checkVerifyToken = require('./checkVerifyToken');

// Schedule the job to run every miniute
cronjob.schedule('* * * * *', () => {
    console.log('Running checkVerifyToken job every minute');
    checkVerifyToken.checkVerifyToken();
});

console.log('Cron job for checkVerifyToken has been scheduled.');