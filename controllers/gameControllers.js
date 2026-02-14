const gameModel = require('../models/Game');
// const userModel = require('../models/userModel');
const gameService = require('../services/gameService');
exports.createGame = async (req, res) => {
    try {
        const gameData = req.body;
        const newGame = await gameService.createGame(gameData);
        return res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const games = await gameService.getAllGames();
        return res.status(200).json(games);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
};
exports.getGameById = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await gameService.getGameById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'khong tim thay game' });
        }
        return res.json(game);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
};
exports.updateGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const gameData = req.body;
        const updatedGame = await gameService.updateGame(gameId, gameData);
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        return res.json(updatedGame);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi' });
    }
}
exports.deleteGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const deletedGame = await gameService.deleteGame(gameId.toString());
        if (!deletedGame) {
            return res.status(404).json({ message: 'khong tim thay game' });
        }
        return res.json({ message: 'thanh cong' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.searchGames = async (req, res) => {
    try {
        console.log('Received search request with query:', req.query);
        const query = req.query;
        const games = await gameService.serchGames(query);
        return res.json(games);
    } catch (error) {
        return res.status(500).json({ error: 'loi loi loi ' });
        console.error('Error searching games:', error);     
    }
};