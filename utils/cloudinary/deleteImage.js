const cloudinary = require('../../config/cloudinary');
const deleteImage = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        const publicId = imageUrl.split('/').slice(-3).join('/').split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}
module.exports = { deleteImage };