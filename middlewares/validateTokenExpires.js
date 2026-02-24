const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const socketApi = require('../config/socket');
const validateTokenExpires = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // if (user.iat + 3600 * 1000 < Date.now()) {
        //     console.log("thoi gian cua token: ", user.iat + 3600 * 1000);
        //     return res.status(401).json({ error: 'Token expired' });
        // }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // socketApi.emit('tokenExpired', { error: 'Token expired' });
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports = validateTokenExpires;