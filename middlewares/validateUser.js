const Joi = require('joi');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validateUser = async (req, res, next) => {
    const schema = {
        '/register':
            Joi.object({
                username: Joi.string().min(3).max(30).required().messages({
                    'string.empty': 'can co username',
                }).pattern(new RegExp('^[a-zA-Z0-9_]+$')).messages({
                    'string.pattern.base': 'Username khong duoc chua ky tu dac biet ngoai dau gach duoi',
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
        '/forgot-password':
            Joi.object({
                email: Joi.string().email().required().messages({
                    'string.email': 'Email khong hop le',
                    'string.empty': 'can co email',
                }),
                username: Joi.string().min(3).max(30).required().messages({
                    'string.min': 'Username it nhat 3 ky tu',
                    'string.max': 'Username toi da 30 ky tu',
                })
            }).unknown(false),
        '/reset-password':
            Joi.object({
                otp: Joi.string().length(6).required().messages({
                    'string.length': 'OTP phai co 6 ky tu',
                    'string.empty': 'can co OTP',
                }),
                newPassword: Joi.string().min(6).max(30).required().pattern(new RegExp('^[a-zA-Z0-9@#$%!*]{6,30}$')).messages({
                    'string.empty': 'can co password',
                    'string.pattern.base': 'Password phai tu 6-30 ky tu va khong chua ky tu dac biet',
                }),
            }).unknown(false)

    };
    const route = req.path;
    if (!schema[route]) {
        return res.status(400).json({ error: 'Invalid route' });
    }
    const { error } = schema[route].validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateUser;