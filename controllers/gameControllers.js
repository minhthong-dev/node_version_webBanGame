const gameModel = require('../models/Game');
// const userModel = require('../models/userModel');

exports.createGame = async (req, res) => {
    try {
        const game = new gameModel(req.body);
        const savedGame = await game.save();
        res.status(201).json(savedGame);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const games = await gameModel.find({});
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};