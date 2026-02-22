const cartModel = require('../models/cartModel');
const gameModel = require('../models/gameModel');
const userModel = require('../models/userModel');
const { Op } = require('sequelize');

const addToCart = async (userId, gameId) => {
    try {
        const gameExitInCart = await cartModel.findOne({ where: { userId, gameId } });
        if (gameExitInCart) {
            throw new Error('Game đã có trong giỏ hàng');
        }
        const game = await gameModel.findByPk(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        const user = await userModel.findByPk(userId);
        if (!user) {
            throw new Error('User không tồn tại');
        }
        const cart = await cartModel.create({ userId, gameId });
        return cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}
const getCartByUserId = async (userId) => {
    try {
        const cart = await cartModel.findAll({ where: { userId } });
        return cart;
    } catch (error) {
        console.error('Error getting cart by user id:', error);
        throw error;
    }
}
const removeFromCart = async (userId, gameId) => {
    try {
        const cart = await cartModel.findOne({ where: { userId, gameId } });
        if (!cart) {
            throw new Error('Game không có trong giỏ hàng');
        }
        await cart.destroy();
        return cart;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}
module.exports = {
    addToCart,
    getCartByUserId,
    removeFromCart
}