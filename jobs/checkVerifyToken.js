const User = require('../models/User');

exports.checkVerifyToken = async () => {
    try {
        const now = new Date();

        const result = await User.deleteMany({
            isVerified: false,
            verifyTokenExpires: { $lt: now }
        });

        console.log(`Deleted ${result.deletedCount} unverified users (expired verify token).`);
    } catch (err) {
        console.error('Error deleting expired unverified users:', err);
    }
}