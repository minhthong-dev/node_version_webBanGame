const cartService = require('../services/cartService');
// const { Op } = require('sequelize');

const addToCart = async (req, res) => {
    try {
        const { userId, gameId } = req.body;
        const cart = await cartService.addToCart(userId, gameId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const removeFromCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const gameId = req.params.gameId;
        const cart = await cartService.removeFromCart(userId, gameId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const isGameInCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const gameId = req.params.gameId;
        const a = await cartService.isGameInCart(userId, gameId)
        if (a) {
            return res.status(200).json(true)
        }
        return res.sattus(200).json(fales)
    } catch (error) { res.sattus(500).json({ error: 'loi roi' }) }
}
module.exports = {
    addToCart,
    getCartByUserId,
    removeFromCart,
    isGameInCart
}
