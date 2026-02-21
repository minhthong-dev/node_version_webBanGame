const crypto = require('crypto');

exports.generateVerifyToken = function () {
    return crypto.randomBytes(32).toString("hex");
}
exports.generateVerifyTokenWithExpiry = function () {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 1 minutes
    // 3600 * 1000; // 1 hour
    return expiresAt;
}