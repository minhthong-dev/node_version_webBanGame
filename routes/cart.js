const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validateTokenExpires = require('../middlewares/validateTokenExpires');
const validateAdmin = require('../middlewares/validateAdmin');

// GET /api/cart/all - Admin: lấy toàn bộ giỏ hàng
router.get('/all', validateAdmin, cartController.getAllCarts);

router.get('/:userId', validateTokenExpires, cartController.getCartByUserId);

router.post('/add', validateTokenExpires, cartController.addToCart);

router.post('/remove/:product', validateTokenExpires, cartController.removeFromCart);

router.get('/incart/:gameId', validateTokenExpires, cartController.isGameInCart);

router.get('/gameincart/:userId/:gameId', validateTokenExpires, cartController.isGameInCart);

router.delete('/:userId/:gameId', cartController.removeFromCartLegacy);

module.exports = router;