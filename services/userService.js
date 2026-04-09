const User = require('../models/User');
const otpUtils = require('../utils/optForgotPassWord');
const emailService = require('./emailService');
const paymentService = require('./paymentService');
const historyService = require('./historyService');
const socketApi = require('../config/socket');
const bcrypt = require('bcrypt');
const historyChatService = require('./historyChatService');
const { boolean } = require('joi');
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
const getAdminList = async () => {
    const adminList = await User.find({
        role: { $in: ['admin', 'super_admin'] }
    });
    return adminList;
}
var isUserBlock = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return { error: "user khong ton tai" };
    }
    else {
        if (user.isBlock) {
            return true;
        }
    }
    return false;
}
// auth
const registerUser = async (userData) => {
    const user = new User(userData);
    await historyChatService.createChat(user._id);
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
    if (user.isVerified === null) {
        return { error: "user chua xac thuc email" };
    }
    const token = require('jsonwebtoken').sign({ id: user._id, role: user.role, username: user.username, email: user.email, amount: user.amount }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { ...user._doc, token };
}
const oauthCallBack = async (passportUser) => {
    if (!passportUser || (!passportUser.id && !passportUser._id)) {
        return { error: "user khong ton tai" };
    }
    const user = await User.findById(passportUser.id || passportUser._id);
    if (!user) {
        return { error: "user khong ton tai" };
    }
    if (user.isBlock) {
        return { error: "user bi khoa" };
    }
    if (user.isVerified === null) {
        return { error: "user chua xac thuc email" };
    }
    const token = require('jsonwebtoken').sign({ id: user._id, role: user.role, username: user.username, email: user.email, amount: user.amount }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
const createPaymentLink = async (amount, description, orderCode, userId) => {
    const user = await User.findById(userId)
    if (!user) {
        return { error: "user khong ton tai" };
    } else {
        const paymentLink = await paymentService.createPaymentLink(amount, description, orderCode);
        console.log("payment link: ", paymentLink);
        return paymentLink;
    }
    return { error: "user khong ton tai" };
}
const getAmoutByid = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        return { error: "user khong ton tai" };
    }
    return user.amount;
}
const updateAmount = async (userId, amount) => {
    console.log(userId, amount)
    try {
        const user = await User.findById(userId)
        if (!user) {
            return false;
        }
        user.amount += amount
        await historyService.createHistory(userId, 'amount', amount, []);
        await user.save()
        console.log("room: ", socketApi.io.sockets.adapter.rooms);
        socketApi.io.to(userId).emit('nap_tien_thanh_cong', 'update_amount');
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}
const updatePassRequest = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            return false;
        }
        user.otpChangePass = otpUtils.generateOTP();
        user.otpChangePassExpiry = otpUtils.generateOTPExpiry();
        console.log(user.otpChangePass)
        await user.save();
        await emailService.sendUpdatePassEmail(user.email, user.otpChangePass);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
const updatePass = async (otp, newPass) => {
    try {
        const user = await User.findOne({ otpChangePass: otp });
        console.log(newPass)
        console.log(user)
        console.log(otp)
        if (user.otpChangePass != otp) {
            return { error: "opt khong hop le" };
        }
        if (user.otpChangePassExpiry < Date.now()) {
            user.otpChangePass = null;
            user.otpChangePassExpiry = null;
            await user.save();
            return { error: "opt da het han, vui long nhan lai otp" };
        }
        const isMatch = await bcrypt.compare(newPass, user.password);
        if (isMatch) {
            console.log("isMatch", isMatch)
            return { error: "mat khau moi cung dc trung voi mau khau cu" };
        }
        user.password = newPass;
        user.otpChangePass = null;
        user.otpChangePassExpiry = null;
        console.log("user: ", user)
        await user.save();
        return { success: true };
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    registerUser,
    loginUser,
    getallUsers,
    fotgotPassword,
    resetPassword,
    blockUser,
    unblockUser,
    createPaymentLink,
    updateAmount,
    getAmoutByid,
    oauthCallBack,
    updatePassRequest,
    updatePass,
    getAdminList,
    isUserBlock
};