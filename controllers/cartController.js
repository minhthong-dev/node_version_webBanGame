const cartService = require('../services/cartService');

const addToCart = async (req, res) => {
    try {
        const { gameId ,userId} = req.body;
        const quantity = req.body.quantity || 1;
        const cart = await cartService.addToCart(userId, gameId, quantity);
        if (cart.error) return res.status(cart.statusCode || 400).json({ error: cart.error });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCartByUserId = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product, quantity } = req.body;
        const cart = await cartService.removeFromCart(userId, product, quantity);
        if (cart.error) return res.status(cart.statusCode || 400).json({ error: cart.error });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isGameInCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product } = req.params;
        const exists = await cartService.isGameInCart(userId, product);
        return res.status(200).json(exists);
    } catch (error) { res.status(500).json({ error: 'loi roi' }); }
};

const removeFromCartLegacy = async (req, res) => {
    try {
        const userId = req.params.userId;
        const gameId = req.params.gameId;
        const cart = await cartService.removeFromCart(userId, gameId);
        if (cart.error) return res.status(cart.statusCode || 400).json({ error: cart.error });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json({ total: carts.length, data: carts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addToCart,
    getCartByUserId,
    removeFromCart,
    isGameInCart,
    removeFromCartLegacy,
    getAllCarts
};
