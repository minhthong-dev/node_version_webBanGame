const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/hello', (req, res) => {
    return res.status(200).json({ message: 'concac' });
});
router.get('/:userId', cartController.getCartByUserId);

router.delete('/:userId/:gameId', cartController.removeFromCart);

router.post('/add', cartController.addToCart);

router.get('/incart/:userId/:gameId', cartController.isGameInCart)

module.exports = router;