const Joi = require('joi');
const validateCategories = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(50).required().pattern(new RegExp('^[a-zA-ZÀ-ỹ ]+$')).messages({
            'string.pattern.base': 'ten danh muc khong duoc chua ky tu dac biet',
            'string.min': 'ten danh muc phai co it nhat 2 ky tu',
            'string.max': 'ten danh muc phai co toi da 50 ky tu',
        })
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}
module.exports = validateCategories;