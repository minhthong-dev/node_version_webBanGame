const gameModel = require('../models/Game');
//const userModel = require('../models/userModel');

const createGame = async (gameData) => {
    const game = new gameModel(gameData);
    return await game.save();
}

const getAllGames = async () => {
    return await gameModel.find({});
}

module.exports = {
    createGame,
    getAllGames
};