const User = require('../models/User');

exports.checkVerifyToken = async () => {
    try {
        const now = new Date();
        console.log('now: ', now.toISOString());
        const users = await User.find({
            isVerified: null,
            verifyTokenExpiry: { $lt: now }
        });
        console.log(`Found ${users.length} unverified users (expired verify token).`);
        if (users.length > 0) {
            const userIds = users.map(user => user._id);
            const result = await User.deleteMany({
                _id: { $in: userIds }
            });
            console.log(`Deleted ${result.deletedCount} unverified users (expired verify token).`);
        }
    } catch (err) {
        console.error('Error deleting expired unverified users:', err);
    }
}