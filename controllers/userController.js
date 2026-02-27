const userService = require('../services/userService');
const emailService = require('../services/emailService');
const verifyToken = require('../utils/verifyToken');
const User = require('../models/User');
const paymentService = require('../services/paymentService');
// admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getallUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "loi he thong" });
    }
}
exports.blockUser = async (req, res) => {
    try {
        const result = await userService.blockUser(res, req);
        if (result) {
            return res.status(200).json({ message: 'block nguoi dung thanh cong' })
        } else {
            return res.status(200).json({ message: 'block nguoi dung thanh cong' })
        }
    } catch (error) { res.status(500).json({ error: 'loi loi roi cac ban oi' }) }
}
exports.unblockUser = async (req, res) => {
    try {
        const result = await userService.unblockUser(res, req);
        if (result) {
            return res.status(200).json({ message: 'bo block nguoi dung thanh cong' })
        } else {
            return res.status(200).json({ message: 'bo block nguoi dung thanh cong' })
        }
    } catch (error) { res.status(500).json({ error: 'loi loi roi cac ban oi' }) }
}
// auth
exports.register = async (req, res) => {
    try {
        const userData = req.body;
        console.log("nhan tu sever: ", req.body);
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
        if (existingUser) {
            if (existingUser.email === userData.email) {
                return res.status(400).json({ message: 'Email da duoc su dung' });
            }
            if (existingUser.username === userData.username) {
                return res.status(400).json({ message: 'Username da duoc su dung' });
            }
        }

        userData.verifyToken = verifyToken.generateVerifyToken();
        userData.verifyTokenExpiry = verifyToken.generateVerifyTokenWithExpiry();
        const newUser = await userService.registerUser(userData);
        try {
            await emailService.sendEmailVerification(newUser._id, newUser.email, userData.verifyToken);
        } catch (err) {
            console.log('loi dcm: ', err)
        }
        res.status(200).json({ message: "dang ky thanh cong, vui long kiem tra email de xac thuc tai khoan", });
    } catch (error) {
        res.status(500).json({ message: "loi he thong" });
    }
};

exports.login = async (req, res) => {
    try {
        const { loginKey, password } = req.body;
        const user = await userService.loginUser(loginKey, password);
        if (user && user.token) {
            res.status(200).json({
                message: "dang nhap thanh cong",
                token: user.token
            });
        } else {
            console.log("user: ", user);
            if (user.error === 'user bi khoa') {
                res.status(403).json({ message: 'user bi khoa' });
            }
            if (user.error === 'user khong ton tai') {
                res.status(404).json({ message: 'user khong ton tai' });
            }
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: "loi he thong" });
    }
}
// exports.sendVerifyEmail = async (req, res) => {
//     try {
//         const { token, shortId } = req.query;
//         const result = await emailService.verifyEmail(token, shortId);
//         if (result.success) {
//             res.status(200).json({ message: "da gui email, vui long kiem tra" });
//         } else {
//             res.status(400).json({ message: 'loi trong qa trinh gui' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }   
exports.verifyEmail = async (req, res) => {
    try {
        const { token, shortId } = req.query;
        await emailService.verifyEmail(token, shortId, res);
    } catch (error) {
        res.status(500).json({ message: "loi he thong" });
    }
}
// forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email, username } = req.body;
        const result = await userService.fotgotPassword(email, username);
        if (result.success) {
            res.status(200).json({ message: "da gui email, vui long kiem tra" });
        } else {
            res.status(400).json({ message: "loi he thong" });
            console.log(result.error);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        const result = await userService.resetPassword(otp, newPassword);
        if (result.success) {
            res.status(200).json({ message: "doi mat khau thanh cong" });
        } else {
            res.status(400).json({ message: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: "loi he thong" });
    }
}
exports.createPaymentLink = async (req, res) => {
    try {
        const orderCode = Number(Date.now());
        const { amount, description } = req.body;
        //const parts = description.split('-')
        const userId = description

        //console.log("user id: ", userId)
        const paymentLink = await userService.createPaymentLink(Number(amount), description, orderCode, userId);
        res.status(200).json(paymentLink);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "loi he thong" });
    }
}
exports.updateAmout = async (req, res) => {
    try {
        // if (req.body.code !== '00') {
        //     return res.status(400).json({ message: "co van de" });
        // }
        // const webhookData = paymentService.verifyWebhookData(req.body);
        // console.log('Xác thực Webhook thành công:', webhookData);
        const userId = req.body.data.description
        const amount = req.body.data.amount
        const result = await userService.updateAmount(userId, amount)
        if (result) {
            res.status(200).json({ message: "cap nhat thanh cong" });
        } else {
            res.status(400).json({ message: "loi he thong" });
        }
        // res.status(200).send('OK');
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "loi roi cac ban oi" })
    }
}
exports.getAmount = async (req, res) => {
    //console.log(req)
    try {
        const userId = req.params.userId;
        const amount = await userService.getAmoutByid(userId);
        res.status(200).json({ amount });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "loi roi cac ban oi" })
    }
}