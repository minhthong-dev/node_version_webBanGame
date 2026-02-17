const User = require('../models/User');
const otpUtils = require('../utils/optForgotPassWord');
const emailService = require('./emailService');

// admin
const getallUsers = async () => {
    return await User.find({});
}
// auth
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
    const token = require('jsonwebtoken').sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { ...user._doc, token };
}
// forgot password
const fotgotPassword = async (email, username) => {
    const user = await User.findOne({ email, username });
    if (!user) {
        return { error: "user khong ton tai" };
        
    }
    const OTP_EXTRA_TIME = 15 * 60 * 1000; // 15 minutes
    const otp = otpUtils.generateOTP();
    const otpExpiry = otpUtils.generateOTPExpiry() + OTP_EXTRA_TIME;
    user.otpForgotPassword = otp;
    user.otpForgotPasswordExpiry = otpExpiry;
    await user.save();
    if (!user.isVerified) {
        
        return { error: "user chua xac thuc email" };
    }
    emailService.sendForgotPasswordOTP(user.email, otp);
    return { success: true };
}
const resetPassword = async (otp, newPassword, date) => {
    console.log("nhan duoc: ", otp, newPassword);
    const user = await User.findOne({ otpForgotPassword: otp });
    if (!user) {
        return { error: "opt khong hop le" };
    }
    const isMatch = await require('bcrypt').compare(newPassword, user.password);
    if (isMatch) {
        return { error: "mat khau moi cung dc trung voi mau khau cu" };
    }
    if (user.otpForgotPasswordExpiry < Date.now()) {
        return { error: "opt da het han" };
    }
    user.password = newPassword;
    user.otpForgotPassword = null;
    user.otpForgotPasswordExpiry = null;
    await user.save();
    return { success: true };
}
module.exports = {
    registerUser,
    loginUser,
    getallUsers,
    fotgotPassword,
    resetPassword
};