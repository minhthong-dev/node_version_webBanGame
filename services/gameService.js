const gameModel = require('../models/Game');
//const userModel = require('../models/userModel');
const uploadImage = require('../utils/cloudinary/uploadImage');


const createGame = async (gameData) => {
    const game = new gameModel(gameData);
    return await game.save();
}

const getAllGames = async () => {
    return await gameModel.find({});
}
const getGameById = async (gameId) => {
    return await gameModel.findById(gameId);
}
const updateGame = async (gameId, gameData) => {
    return await gameModel.findByIdAndUpdate(gameId, gameData, { new: true });
}
const deleteGame = async (gameId) => {
    return await gameModel.findByIdAndDelete(gameId);
}
const searchGames = async (query) => {
    console.log('Received search query in service:', query);
    let searchQuery = {};
    const { name, genre, platform, releaseDate, minPrice, maxPrice } = query;
    console.log('Parsed query parameters:', { name, genre, platform, releaseDate, minPrice, maxPrice });
    if (query.name) {
        searchQuery.name = { $regex: query.name, $options: 'i' };
    }
    if (query.genre) {
        searchQuery.genre = { $regex: query.genre, $options: 'i' };
    }
    if (query.platform) {
        searchQuery.platform = { $regex: query.platform, $options: 'i' };
    }
    if (query.releaseDate) {
        searchQuery.releaseDate = { $regex: query.releaseDate, $options: 'i' };
    }
    if (query.minPrice || query.maxPrice) {
        searchQuery.price = {};
        if (query.minPrice) {
            searchQuery.price.$gte = query.minPrice;
        }
        if (query.maxPrice) {
            searchQuery.price.$lte = query.maxPrice;
        }
    }
    return await gameModel.find(searchQuery);
}
const uploadCoverImage = async (gameId, filePath) => {
    try {
        if (!gameId) {
            throw new Error('thiu game id');
        }
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('game khong ton tai');
        }
        const result = await uploadImage.uploadImage(filePath, 'games_cover');
        if (!result || !result.imageUrl) {
            throw new Error('khong the upload hinh');
        }
        game.media.coverImage = result.imageUrl;
        if (game) { console.log('game sau khi upload cover: ', game) }
        await game.save();
        return { success: true, imageUrl: result.imageUrl };
    } catch (error) {
        console.error('Error uploading cover image:', error);
        throw new Error('loi khi upload cover game');
    }
};
const uploadScreenshotImage = async (gameId, files) => {
    try {
        if (!gameId) {
            throw new Error('thiu game id');
        }
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('game khong ton tai');
        }
        const uploadedImageUrls = [];
        for (const file of files) {
            const result = await uploadImage.uploadImage(file.path, 'games_screenshots');
            if (result && result.imageUrl) {
                game.media.screenshots.push(result.imageUrl);
                uploadedImageUrls.push(result.imageUrl);
            }
        }
        if (game) { console.log('game sau khi upload screenshot: ', game) }
        await game.save();
        return { success: true, imageUrls: uploadedImageUrls };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('loi khi upload game');
    }
}
const deleteImage = async (gameId, type, imageUrl) => {
    try {
        const game = await gameModel.findById(gameId);
        if (type === 'cover') {
            game.media.coverImage = null;
        } else if (type === 'screenshot') {
            const screenshotIndex = game.media.screenshots.indexOf(imageUrl);
            if (screenshotIndex > -1) {
                game.media.screenshots.splice(screenshotIndex, 1);
            }
        }
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('loi khi xoa hinh');
    }
}
module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    searchGames,
    uploadCoverImage,
    uploadScreenshotImage,
    deleteImage
};