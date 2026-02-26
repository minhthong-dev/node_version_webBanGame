const historyModel = require('../models/History');
const createHistory = async (userId, type, totalValue, gameId) => {
    const history = new historyModel({
        userId,
        type,
        totalValue,
        gameId
    });
    return await history.save();
}

module.exports = {
    createHistory
}       