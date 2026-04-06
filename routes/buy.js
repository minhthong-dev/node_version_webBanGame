const express = require('express');
const router = express.Router();
const buyController = require('../controllers/buyController');
const validateTokenExpires = require('../middlewares/validateTokenExpires');

router.post('/', validateTokenExpires, buyController.buyGame);

module.exports = router;