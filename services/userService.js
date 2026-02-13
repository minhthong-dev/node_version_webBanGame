const User = require('../models/User');

const registerUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}
const loginUser = async (loginKey, password) => {
    const user = await User.findOne({ $or: [{ email: loginKey }, { username: loginKey }] });
    if (!user) {
        return { error: "user khong ton tai" };
    }
    const isMatch = await require('bcrypt').compare(password, user.password);
    if (!isMatch) {
        return { error: "mat khau khong dung" };
    }
    const token= require('jsonwebtoken').sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { ...user._doc, token };
}
const getallUsers = async () => {
    return await User.find({});
}
module.exports = {
    registerUser,
    loginUser,
    getallUsers
};