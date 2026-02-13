const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validateUser = async (req, res, next) => {
    const schema = {
        '/register':
            Joi.object({
                username: Joi.string().min(3).max(30).required().messages({
                    'string.empty': 'can co username',
                }),
                email: Joi.string().email().required().messages({
                    'string.email': 'Email khong hop le',
                    'string.empty': 'can co email',
                }),
                password: Joi.string().min(6).max(30).required().pattern(new RegExp('^[a-zA-Z0-9@#$%!*]{6,30}$')).messages({
                    'string.empty': 'can co password',
                    'string.pattern.base': 'Password phai tu 6-30 ky tu va khong chua ky tu dac biet',
                }),

            }).unknown(false),
        '/login':
            Joi.object({
                loginKey: Joi.alternatives().try(
                    Joi.string().email().messages({
                        'string.email': 'Email khong hop le',
                    }),
                    Joi.string().min(3).max(30).messages({
                        'string.min': 'Username it nhat 3 ky tu',
                        'string.max': 'Username toi da 30 ky tu',
                    })
                ).required().messages({
                    'any.required': 'can co email hoac username',
                }),
                password: Joi.string().min(6).max(30).required().pattern(new RegExp('^[a-zA-Z0-9@#$%!*]{6,30}$')).messages({
                    'string.empty': 'can co password',
                    'string.pattern.base': 'Password phai tu 6-30 ky tu va khong chua ky tu dac biet',
                }),
            }),
        '/all':
            Joi.object({}).unknown(false),
    };
    const route = req.path;
    if (!schema[route]) {
        return res.status(400).json({ error: 'Invalid route' });
    }
    const { error } = schema[route].validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const exitUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (exitUser) {
            if (exitUser.email == req.body.email) {
                return res.status(400).json({ error: 'Email da duoc su dung' });
            }
            if (exitUser.username == req.body.username) {
                return res.status(400).json({ error: 'Username da duoc su dung' });
            }
        }
        // if (req.path === '/all') {
        //     console.log("vao day: ", req.path);
        //     const token = req.headers.authorization?.split(' ')[1];

        //     if (!token) {
        //         return res.status(401).json({ error: 'ban can dang nhap' });
        //     }
        //     try {
        //         const decode = jwt.verify(token, process.env.JWT_SECRET);
        //         const user = await User.findById(decode.id);
        //         if (user.role !== 'admin') {
        //             return res.status(403).json({ error: 'ban khong co quyen truy cap' });
        //         }
        //     } catch (err) {
        //         return res.status(401).json({ error: 'Token khong hop le' });
        //     }

        // }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
    next();
};

module.exports = validateUser;