const mongoose = require('mongoose');
const preOrderModel = require('../models/PreOrder');
const gameModel = require('../models/Game');
const inventoryModel = require('../models/Inventory');
const userModel = require('../models/User');
const historyService = require('./historyService');
const emailService = require('./emailService');
const crypto = require('crypto');

const createPreOrder = async (userId, gameId, quantity = 1) => {
    const game = await gameModel.findById(gameId);
    if (!game) return { error: 'Game không tồn tại' };

    const inventory = await inventoryModel.findOne({ gameId });
    const now = new Date();
    const isUnreleased = game.releaseDate > now;
    const isOutOfStock = !inventory || inventory.stock === 0;

    if (!isUnreleased && !isOutOfStock) {
        return { error: 'Game đang có sẵn, không cần đặt trước' };
    }

    const reason = isUnreleased ? 'unreleased' : 'out_of_stock';

    const existing = await preOrderModel.findOne({ userId, gameId });
    if (existing && existing.status === 'pending') {
        return { error: 'Bạn đã đặt trước game này rồi' };
    }

    const preOrder = new preOrderModel({
        userId,
        gameId,
        quantity,
        priceLocked: game.price,
        reason,
        status: 'pending'
    });

    await preOrder.save();
    return { success: true, preOrder };
};

const getMyPreOrders = async (userId) => {
    const preOrders = await preOrderModel
        .find({ userId })
        .populate('gameId', 'name price releaseDate media')
        .sort({ createdAt: -1 });
    return preOrders;
};

const cancelPreOrder = async (userId, preOrderId) => {
    const preOrder = await preOrderModel.findOne({ _id: preOrderId, userId });
    if (!preOrder) return { error: 'Pre-order không tồn tại' };
    if (preOrder.status !== 'pending') return { error: 'Chỉ có thể huỷ pre-order đang chờ' };

    preOrder.status = 'cancelled';
    await preOrder.save();
    return { success: true, message: 'Đã huỷ pre-order thành công' };
};

const fulfillEligiblePreOrders = async () => {
    const session = await mongoose.startSession();
    const now = new Date();

    const pendingOrders = await preOrderModel
        .find({ status: 'pending' })
        .populate('gameId')
        .populate('userId');

    let fulfilledCount = 0;

    for (const order of pendingOrders) {
        const game = order.gameId;
        const user = order.userId;

        if (!game || !user) continue;

        const isStillUnreleased = game.releaseDate > now;
        if (isStillUnreleased) continue;

        const inventory = await inventoryModel.findOne({ gameId: game._id });
        if (!inventory || inventory.stock < order.quantity) continue;

        const totalCost = game.price * order.quantity;
        if (user.amount < totalCost) continue;

        try {
            await session.withTransaction(async () => {
                const updated = await inventoryModel.findOneAndUpdate(
                    { gameId: game._id, $expr: { $gte: ['$stock', order.quantity] } },
                    { $inc: { stock: -order.quantity } },
                    { session, new: true }
                );
                if (!updated) throw new Error('stock_gone');

                const freshUser = await userModel.findById(user._id).session(session);
                if (freshUser.amount < totalCost) throw new Error('balance_gone');
                freshUser.amount -= totalCost;
                await freshUser.save({ session });

                order.status = 'fulfilled';
                order.fulfilledAt = now;
                await order.save({ session });

                await historyService.createHistory(user._id, 'buying', totalCost, [game._id]);
            });

            const gameKey = crypto.randomBytes(8).toString('hex').toUpperCase();
            await emailService.sendBuyGameSuccessEmail(user.email, [{ name: game.name, key: gameKey }]);
            fulfilledCount++;
        } catch (err) {
            continue;
        }
    }

    session.endSession();
    return fulfilledCount;
};

module.exports = {
    createPreOrder,
    getMyPreOrders,
    cancelPreOrder,
    fulfillEligiblePreOrders
};
