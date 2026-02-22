const gameModel = require('../models/Game');
//const userModel = require('../models/userModel');
const uploadImage = require('../utils/cloudinary/uploadImage');
const crypto = require('../utils/cryptojs');
const deleteImage = require('../utils/cloudinary/deleteImage');


const createGame = async (gameData) => {
    console.log('gameData: ', gameData);
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
    if (gameData.trailer) {
        gameData['media.trailer'] = gameData.trailer;
    }
    return await gameModel.findByIdAndUpdate(gameId, gameData, { new: true });
}
const deleteGame = async (gameId) => {
    return await gameModel.findByIdAndDelete(gameId);
}
const searchGames = async (params) => {
    console.log('Received search params in service:', params);
    let decodeQuery = {};
    try {
        const encryptedData = params.q || params;
        decodeQuery = crypto.decrypt(encryptedData);
        console.log('Decoded query:', decodeQuery);
    } catch (error) {
        console.error('Error decrypting query:', error);
        return [];
    }
    let searchQuery = {};

    const { name, genre, platform, releaseDate, minPrice, maxPrice } = decodeQuery;
    console.log('Parsed query parameters:', { name, genre, platform, releaseDate, minPrice, maxPrice });
    if (decodeQuery.name) {
        searchQuery.name = { $regex: decodeQuery.name, $options: 'i' };
    }
    if (decodeQuery.genre) {
        searchQuery.genre = { $regex: decodeQuery.genre, $options: 'i' };
    }
    if (decodeQuery.platform) {
        searchQuery.platform = { $regex: decodeQuery.platform, $options: 'i' };
    }
    if (decodeQuery.releaseDate) {
        searchQuery.releaseDate = { $regex: decFodeQuery.releaseDate, $options: 'i' };
    }
    if (decodeQuery.minPrice !== undefined && decodeQuery.minPrice !== '') {
        const min = Number(decodeQuery.minPrice);
        //console.log('min: ', min);
        if (!isNaN(min)) {
            if (!searchQuery.price) searchQuery.price = {};
            searchQuery.price.$gte = min;
        }
    }
    if (decodeQuery.maxPrice !== undefined && decodeQuery.maxPrice !== '') {
        const max = Number(decodeQuery.maxPrice);
        if (!isNaN(max)) {
            if (!searchQuery.price) searchQuery.price = {};
            searchQuery.price.$lte = max;
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
const deleteImageSer = async (gameId, type, imageUrl) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.media) {
            game.media = { screenshots: [] };
        }

        if (type === 'cover') {
            await deleteImage.deleteImage(imageUrl);
            game.media.coverImage = null;
        } else if (type === 'screenshot') {
            await deleteImage.deleteImage(imageUrl);
            if (game.media.screenshots) {
                const screenshotIndex = game.media.screenshots.indexOf(imageUrl);
                if (screenshotIndex > -1) {
                    game.media.screenshots.splice(screenshotIndex, 1);
                }
            }
        } else {
            throw new Error('Loại ảnh không hợp lệ');
        }
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}
const addToWishlist = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.wishlist) {
            game.wishlist = [];
        }
        if (game.wishlist.includes(userId)) {
            throw new Error('Game đã có trong wishlist');
        }
        game.wishlist.push(userId);
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}
const removeFromWishlist = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.wishlist) {
            game.wishlist = [];
        }
        if (!game.wishlist.includes(userId)) {
            throw new Error('Game không có trong wishlist');
        }
        game.wishlist.splice(game.wishlist.indexOf(userId), 1);
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}
const getWishlistByUserId = async (userId) => {
    try {
        const games = await gameModel.find({ wishlist: userId });
        return games;
    } catch (error) {
        console.error('Error getting wishlist:', error);
        throw error;
    }
}
const isWishlist = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.wishlist) {
            game.wishlist = [];
        }
        if (game.wishlist.includes(userId)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking wishlist:', error);
        throw error;
    }
}
const like = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.like) {
            game.like = [];
        }
        if (game.like.includes(userId)) {
            throw new Error('Game đã có trong wishlist');
        }
        game.like.push(userId);
        console.log('game sau khi like: ', game);
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}
const unlike = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.like) {
            game.like = [];
        }
        if (!game.like.includes(userId)) {
            throw new Error('Game không có trong wishlist');
        }
        game.like.splice(game.like.indexOf(userId), 1);
        await game.save();
        return { success: true };
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}
const getLikesByUserId = async (userId) => {
    try {
        const games = await gameModel.find({ like: userId });
        return games;
    } catch (error) {
        console.error('Error getting likes:', error);
        throw error;
    }
}
const isLike = async (gameId, userId) => {
    try {
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        if (!game.like) {
            game.like = [];
        }
        if (game.like.includes(userId)) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking wishlist:', error);
        throw error;
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
    deleteImageSer,
    addToWishlist,
    removeFromWishlist,
    getWishlistByUserId,
    isWishlist,
    like,
    unlike,
    getLikesByUserId,
    isLike
};