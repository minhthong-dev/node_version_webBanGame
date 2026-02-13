const userService = require('../services/userService');

exports.register = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userService.registerUser(userData);
        res.status(201).json(newUser);
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