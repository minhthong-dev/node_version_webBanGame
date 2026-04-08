const cartService = require('../services/cartService');

const addToCart = async (req, res) => {
    try {
        const { product, gameId, quantity } = req.body;
        const resolvedGameId = gameId || product;
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ error: 'unauthorized' });
        if (!resolvedGameId) return res.status(400).json({ error: 'Thiếu gameId' });
        const cart = await cartService.addToCart(userId, resolvedGameId, quantity || 1);
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
        const { product, gameId, quantity } = req.body;
        const resolvedGameId = gameId || product;
        if (!resolvedGameId) return res.status(400).json({ error: 'Thiếu gameId' });
        const cart = await cartService.removeFromCart(userId, resolvedGameId, quantity);
        if (cart.error) return res.status(cart.statusCode || 400).json({ error: cart.error });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isGameInCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gameId, product } = req.params;
        const resolvedGameId = gameId || product;
        if (!resolvedGameId) return res.status(400).json({ error: 'Thiếu gameId' });
        const exists = await cartService.isGameInCart(userId, resolvedGameId);
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
