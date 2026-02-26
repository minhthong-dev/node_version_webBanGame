const User = require('../models/User');
const otpUtils = require('../utils/optForgotPassWord');
const emailService = require('./emailService');
const paymentService = require('./paymentService');
// admin
const getallUsers = async () => {
    return await User.find({});
}
const blockUser = async (res, req) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return { error: "user khong ton tai" };
    }
    user.isBlock = true;
    await user.save();
    return { success: true };
}
const unblockUser = async (res, req) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return { error: "user khong ton tai" };
    }
    user.isBlock = false;
    await user.save();
    return { success: true };
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
    if (user.isBlock) {
        return { error: "user bi khoa" };
    }
    const token = require('jsonwebtoken').sign({ id: user._id, role: user.role, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
// payment
const createPaymentLink = async (amount, description, orderCode) => {
    const paymentLink = await paymentService.createPaymentLink(amount, description, orderCode);
    return paymentLink;
}
module.exports = {
    registerUser,
    loginUser,
    getallUsers,
    fotgotPassword,
    resetPassword,
    blockUser,
    unblockUser,
    createPaymentLink
};