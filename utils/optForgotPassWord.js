const crypto = require('crypto');

exports.generateOTP = function() {
    return crypto.randomBytes(3).toString("hex"); // 6 characters
}
exports.generateOTPExpiry = function() {
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    return expiresAt;
}
