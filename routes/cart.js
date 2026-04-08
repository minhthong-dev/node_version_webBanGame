const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validateTokenExpires = require('../middlewares/validateTokenExpires');

router.get('/', validateTokenExpires, cartController.getCartByUserId);

router.post('/add', validateTokenExpires, cartController.addToCart);

router.post('/remove', validateTokenExpires, cartController.removeFromCart);

router.get('/incart/:gameId', validateTokenExpires, cartController.isGameInCart);

router.delete('/:userId/:gameId', cartController.removeFromCartLegacy);

module.exports = router;