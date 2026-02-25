const jwt = require('jsonwebtoken');
const checkAdmin = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (deocode.role === 'admin' || decode.role === 'super_admin') {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}
module.exports = checkAdmin;