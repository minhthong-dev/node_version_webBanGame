const CryptoJS = require('crypto-js');
const env = require('dotenv');
env.config();

// Mã hóa dữ liệu
exports.encrypt = function (text) {
    const data = typeof text === 'object' ? JSON.stringify(text) : text;
    return CryptoJS.AES.encrypt(data, process.env.CRYPTO_JS_SECRET).toString();
}

// Giải mã dữ liệu
exports.decrypt = function (ciphertext) {
    try {
        if (!ciphertext) return {};

        // Thay thế khoảng trắng bằng dấu '+' (lỗi phổ biến khi truyền qua URL)
        const formattedCiphertext = ciphertext.toString().replace(/ /g, '+');

        const bytes = CryptoJS.AES.decrypt(formattedCiphertext, process.env.CRYPTO_JS_SECRET);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            console.error('Decryption failed: Empty result (possibly wrong key or corrupted data)');
            return {};
        }

        try {
            return JSON.parse(decryptedText);
        } catch (e) {
            return decryptedText;
        }
    } catch (error) {
        console.error('CryptoJS Decrypt Error:', error.message);
        return {};
    }
}