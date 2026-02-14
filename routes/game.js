const gameController = require('../controllers/gameControllers');
const express = require('express');
const router = express.Router();
const validateAdmin = require('../middlewares/validateAdmin');


router.get('/test', (req, res) => {
    res.json({ message: 'Game routes are working!' });
});
router.post('/create', validateAdmin, (req, res) => {
    try {
        gameController.createGame(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get('/all', async (req, res) => {
    try {
        await gameController.getAllGames(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get('/search', async (req, res) => {
    try {
        
        await gameController.searchGames(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const game = await gameController.getGameById(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: 'khong the lay duoc game' });
    }
});
router.put('/:id', validateAdmin, async (req, res) => {
    try {
        await gameController.updateGame(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
router.delete('/:id', validateAdmin, async (req, res) => {
    try {
        await gameController.deleteGame(req, res);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;