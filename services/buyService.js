const mongoose = require('mongoose');
const userModel = require('../models/User');
const gameModel = require('../models/Game');
const inventoryModel = require('../models/Inventory');
const cartModel = require('../models/Cart');
const historyService = require('./historyService');
const socketApi = require('../config/socket');
const emailService = require('./emailService');
const crypto = require('crypto');

const buyGame = async (userId) => {
    const session = await mongoose.startSession();
    let boughtGames = [];
    let userEmail = null;
    let totalAmount = 0;
    const purchasedGameIds = [];

    try {
        await session.withTransaction(async () => {
            const user = await userModel.findById(userId).session(session);
            if (!user) throw new Error('user_not_found');
            userEmail = user.email;

            const cart = await cartModel.findOne({ userId }).session(session);
            if (!cart || cart.products.length === 0) throw new Error('cart_empty');

            for (const item of cart.products) {
                const { product: gameId, quantity } = item;

                const game = await gameModel.findById(gameId).session(session);
                if (!game) throw new Error(`game_not_found:${gameId}`);

                const lineTotal = game.price * quantity;
                totalAmount += lineTotal;

                const inventory = await inventoryModel.findOneAndUpdate(
                    { gameId, $expr: { $gte: ['$stock', quantity] } },
                    { $inc: { stock: -quantity } },
                    { session, new: true }
                );
                if (!inventory) throw new Error(`out_of_stock:${game.name}`);

                const gameKey = crypto.randomBytes(8).toString('hex').toUpperCase();
                boughtGames.push({ name: game.name, key: gameKey });
                purchasedGameIds.push(gameId);
            }

            if (user.amount < totalAmount) throw new Error('not_enough_money');
            user.amount -= totalAmount;
            await user.save({ session });

            await historyService.createHistory(userId, 'buying', totalAmount, purchasedGameIds);

            await cartModel.findOneAndUpdate({ userId }, { $set: { products: [] } }, { session });
        });
    } catch (error) {
        session.endSession();
        const msg = error.message;
        if (msg === 'user_not_found') return { error: 'User không tồn tại' };
        if (msg === 'cart_empty') return { error: 'Giỏ hàng trống' };
        if (msg === 'not_enough_money') return { error: 'Số dư không đủ để thanh toán' };
        if (msg.startsWith('out_of_stock:')) return { error: `Hết hàng: ${msg.split(':')[1]}` };
        if (msg.startsWith('game_not_found:')) return { error: `Game không tồn tại` };
        return { error: 'Lỗi hệ thống, vui lòng thử lại' };
    }

    session.endSession();

    socketApi.io.to(userId.toString()).emit('buy_success', 'update_amount');
    if (boughtGames.length > 0) {
        await emailService.sendBuyGameSuccessEmail(userEmail, boughtGames);
    }

    return { success: true, boughtGames, totalAmount };
};

module.exports = { buyGame };