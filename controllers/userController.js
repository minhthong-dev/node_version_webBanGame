const userService = require('../services/userService');
const emailService = require('../services/emailService');
const verifyToken  = require('../utils/verifyToken');
exports.register = async (req, res) => {
    try {
        const userData = req.body;
        userData.verifyToken = verifyToken.generateVerifyToken();
        userData.verifyTokenExpiry = verifyToken.generateVerifyTokenWithExpiry();
        const newUser = await userService.registerUser(userData);
        const shortUrl = await emailService.sendEmailVerification(newUser._id, newUser.email, userData.verifyToken);
        console.log("shortUrl:", shortUrl);
        if (!shortUrl) {
            res.status(400).json({ message: "loi trong qua trinh gui email xac thuc" , shortUrl });
        }
        res.status(201).json({ message: "dang ky thanh cong, vui long kiem tra email de xac thuc tai khoan",});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { loginKey, password } = req.body;
        const user = await userService.loginUser(loginKey, password);
        if (user && user.token) {
            res.status(200).json({ message: "dang nhap thanh cong",
                token: user.token
             });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getallUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
}   