const User = require('../models/User');

const registerUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}
const loginUser = async (loginKey, password) => {
    const user = await User.findOne({ $or: [{ email: loginKey }, { username: loginKey }], password: password });
    return user;
}
module.exports = {
    registerUser,
    loginUser
};