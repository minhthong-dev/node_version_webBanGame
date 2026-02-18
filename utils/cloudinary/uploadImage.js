const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('../../config/cloudinary');
require('dotenv').config();

exports.uploadImage = async (filePath, type) => {
    try {
        let result;
        if (type === 'games_cover') {
            result = await cloudinary.uploader.upload(filePath, {
                folder: `webbangamechonguoingeo/${type}`,
                overwrite: true,
                use_filename: true,
                unique_filename: false,
                transformation: [
                    { width: 600, height: 800, crop: "fill", gravity: "auto" },
                    { quality: "auto", fetch_format: "auto" }
                ]
            });
        } else if (type === 'games_screenshots') {
            result = await cloudinary.uploader.upload(filePath, {
                folder: `webbangamechonguoingeo/${type}`,
                overwrite: true,
                use_filename: true,
                unique_filename: false,
                transformation: [
                    { width: 1280, height: 720, crop: "fill", gravity: "auto" },
                    { quality: "auto", fetch_format: "auto" }
                ],
            });
        }
        if (!result) { throw new Error('Không thể upload hình'); }
        return { success: true, imageUrl: result.secure_url };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};  