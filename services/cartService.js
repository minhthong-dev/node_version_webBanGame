const cartModel = require('../models/Cart');
const gameModel = require('../models/Game');
const userModel = require('../models/User');

const addToCart = async (userId, gameId) => {
    try {
        const userExitInCart = await cartModel.findOne({ userId });
        if (userExitInCart) {
            const gameExitInCart = await userExitInCart.games.includes(gameId);
            console.log('gameExitInCart: ', gameExitInCart);
            if (gameExitInCart) {
                return ({ error: "Game đã có trong giỏ hàng" })
            }
            await cartModel.updateOne({ userId: userId }, { $push: { games: gameId } })
        }
        const game = await gameModel.findById(gameId);
        if (!game) {
            throw new Error('Game không tồn tại');
        }
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User không tồn tại');
        }
        const cart = await cartModel.create({ userId: user._id, games: game._id });
        await cart.save();
        return cart;

    } catch (error) {
        console.error('Error adding to cart:', error);
        throw new Error('loi khi them game vao gio hang');
    }
}
const getCartByUserId = async (userId) => {
    try {
        const cart = await cartModel.find({ userId });
        if (cart.length === 0) {
            return [];
        }
        return cart;
    } catch (error) {
        console.error('Error getting cart by user id:', error);
        throw new Error('loi khi lay gio hang');
    }
}
const removeFromCart = async (userId, gameId) => {
    try {
        const cart = await cartModel.findOne({ userId: userId, games: gameId });
        console.log('cart: ', cart);
        if (!cart) {
            throw new Error('Game không có trong giỏ hàng');
        }
        await cartModel.updateOne({ userId: userId }, { $pull: { games: gameId } })
        return cart;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('loi khi xoa game ra khoi gio hang');
    }
}
const isGameInCart = async (userId, gameId) => {
    try {
        const cart = await cartModel.findOne({ userId });
        if (cart) {
            const gameExitInCart = await cart.games.includes(gameId);
            return gameExitInCart;
        }
        return false;
    } catch (error) {
        console.error('Error checking if game is in cart:', error);
        throw new Error('loi khi kiem tra game co trong gio hang');
    }
}
module.exports = {
    addToCart,
    getCartByUserId,
    removeFromCart,
    isGameInCart
}