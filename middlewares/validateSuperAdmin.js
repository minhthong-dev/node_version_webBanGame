const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validateSuperAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'super_admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports = validateSuperAdmin;