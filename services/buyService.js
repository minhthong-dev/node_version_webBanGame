const mongoose = require('mongoose');
const userModel = require('../models/User');
const gameModel = require('../models/Game');
const inventoryModel = require('../models/Inventory');
const cartModel = require('../models/Cart');
const walletModel = require('../models/Wallet');
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

            const lines = [];
            for (const item of cart.products) {
                const { product: gameId, quantity } = item;
                const qty = Number(quantity);
                if (!Number.isFinite(qty) || qty < 1) throw new Error(`game_not_found:${gameId}`);

                const game = await gameModel.findById(gameId).session(session);
                if (!game) throw new Error(`game_not_found:${gameId}`);

                const inv = await inventoryModel.findOne({ gameId }).session(session);
                if (!inv || inv.stock < qty) {
                    throw new Error(`out_of_stock:${game.name}`);
                }

                const price = Number(game.price);
                const lineTotal = (Number.isFinite(price) ? price : 0) * qty;
                totalAmount += lineTotal;
                lines.push({ gameId, qty, game, lineTotal });
            }

            const balance = Number(user.amount);
            const safeBalance = Number.isFinite(balance) ? balance : 0;
            if (safeBalance < totalAmount) {
                const err = new Error('not_enough_money');
                err.balance = safeBalance;
                err.totalRequired = totalAmount;
                throw err;
            }

            for (const line of lines) {
                const { gameId, qty, game } = line;
                const inventory = await inventoryModel.findOneAndUpdate(
                    { gameId, $expr: { $gte: ['$stock', qty] } },
                    { $inc: { stock: -qty } },
                    { session, new: true }
                );
                if (!inventory) throw new Error(`out_of_stock:${game.name}`);

                const gameKey = crypto.randomBytes(8).toString('hex').toUpperCase();
                boughtGames.push({ name: game.name, key: gameKey });
                purchasedGameIds.push(gameId);
            }

            user.amount = safeBalance - totalAmount;
            await user.save({ session });

            await historyService.createHistory(userId, 'buying', totalAmount, purchasedGameIds);

            await cartModel.findOneAndUpdate({ userId }, { $set: { products: [] } }, { session });
        });
    } catch (error) {
        session.endSession();
        const msg = error.message;
        if (msg === 'user_not_found') return { error: 'User không tồn tại' };
        if (msg === 'cart_empty') return { error: 'Giỏ hàng trống' };
        if (msg === 'not_enough_money') {
            return {
                error: 'Số dư không đủ để thanh toán',
                balance: error.balance,
                totalRequired: error.totalRequired
            };
        }
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

const buyWallet = async (userId, walletId) => {
    const session = await mongoose.startSession();
    let boughtWallet = null;
    let userEmail = null;
    let totalAmount = 0;

    try {
        await session.withTransaction(async () => {
            const user = await userModel.findById(userId).session(session);
            if (!user) throw new Error('user_not_found');
            userEmail = user.email;

            const wallet = await walletModel.findById(walletId).session(session);
            if (!wallet) throw new Error('wallet_not_found');

            if (wallet.stock < 1) {
                throw new Error(`out_of_stock:${wallet.name}`);
            }

            totalAmount = Number(wallet.price);
            const balance = Number(user.amount);
            const safeBalance = Number.isFinite(balance) ? balance : 0;

            if (safeBalance < totalAmount) {
                const err = new Error('not_enough_money');
                err.balance = safeBalance;
                err.totalRequired = totalAmount;
                throw err;
            }

            wallet.stock -= 1;
            await wallet.save({ session });

            user.amount = safeBalance - totalAmount;
            await user.save({ session });

            const walletKey = crypto.randomBytes(8).toString('hex').toUpperCase();
            boughtWallet = { name: wallet.name, key: walletKey };

            await historyService.createHistory(userId, 'buying', totalAmount, [walletId]); 
        });
    } catch (error) {
        session.endSession();
        console.error('Error in buyWallet:', error);
        const msg = error.message;
        if (msg === 'user_not_found') return { error: 'User không tồn tại' };
        if (msg === 'wallet_not_found') return { error: 'Thẻ không tồn tại' };
        if (msg === 'not_enough_money') {
            return {
                error: 'Số dư không đủ để thanh toán',
                balance: error.balance,
                totalRequired: error.totalRequired
            };
        }
        if (msg.startsWith('out_of_stock:')) return { error: `Hết hàng: ${msg.split(':')[1]}` };
        return { error: 'Lỗi hệ thống, vui lòng thử lại' };
    }

    session.endSession();

    socketApi.io.to(userId.toString()).emit('buy_success', 'update_amount');
    if (boughtWallet) {
        await emailService.sendBuyGameSuccessEmail(userEmail, [boughtWallet]);
    }

    return { success: true, boughtWallet, totalAmount, key: boughtWallet.key };
};

module.exports = { buyGame, buyWallet };