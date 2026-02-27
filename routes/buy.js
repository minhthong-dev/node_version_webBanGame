const express = require('express');
const router = express.Router();
const buyController = require('../controllers/buyController');

router.post('/', buyController.buyGame);

module.exports = router;