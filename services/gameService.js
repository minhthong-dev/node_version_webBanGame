const gameModel = require('../models/Game');
//const userModel = require('../models/userModel');

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
const serchGames = async (query) => {
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
module.exports = {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
    serchGames
};