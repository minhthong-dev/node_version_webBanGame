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
const getHistoryById = async (userId) => {
    const history = await historyModel.find({ userId: userId });
    if (!history) {
        return { error: "history khong ton tai" };
    }
    return history;
}
const getAllhistory = async () => {
    const history = await historyModel.find({});
    if (!history) {
        return { error: "history khong ton tai" };
    }
    return history;
}
module.exports = {
    createHistory,
    getHistoryById,
    getAllhistory
}       