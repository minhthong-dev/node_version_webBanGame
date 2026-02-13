const gameController = require('../controllers/gameControllers');
const express = require('express');
const router = express.Router();
const validateAdmin = require('../middlewares/validateAdmin');


router.get('/test',  (req, res) => {
    res.json({ message: 'Game routes are working!' });
});
router.post('/create', validateAdmin, (req, res) => {
    try {
        gameController.createGame(req, res);
        res.status(201).json({ message: 'Game created successfully!' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = router;