const userModel = require('../models/User');
const historyService = require('./historyService');
const socketApi = require('../config/socket');
const emailService = require('./emailService');
const gameModel = require('../models/Game');
const crypto = require('crypto');
const buyGame = async (userId, amount, gameId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        return { error: "user khong ton tai" };
    }
    if (user.amount < amount) {
        return { error: "so du khong du" };
    }
    user.amount -= amount;
    await historyService.createHistory(userId, 'buying', amount, [gameId]);
    await user.save();
    socketApi.io.to(userId).emit('buy_success', 'update_amount');
    const boughtGames = [];
    for (const id of gameId) {
        const game = await gameModel.findById(id);
        if (game) {
            const gameKey = crypto.randomBytes(8).toString("hex").toUpperCase();
            boughtGames.push({
                name: game.name,
                key: gameKey
            });
        }
    }
    if (boughtGames.length > 0) {
        await emailService.sendBuyGameSuccessEmail(user.email, boughtGames);
    }
    return { success: true };
}
module.exports = {
    buyGame
}