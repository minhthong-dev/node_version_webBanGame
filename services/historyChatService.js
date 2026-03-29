const historychatModels = require('../models/HistoryChat')
const userService = require('../services/userService')
const userModels = require('../models/User')

const getHistoryChatListAdmin = async () => {
    try {
        const historyChat = await historychatModels.find().populate('userId', 'username email');
        const userList = historyChat.map(item => item.userId);
        return userList;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getHistoryChatbyUserId = async (userId) => {
    try {
        const historyChat = await historychatModels.findOne({ userId });
        return historyChat;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const createChat = async (userId) => {
    try {
        const historyChat = await historychatModels.create({ userId });

        await historyChat.save();
        return historyChat;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const addMessUser = async (chatData) => {
    try {
        const userId = chatData.data.infor.userId;
        const content = chatData.message;
        const timestamp = Date.now();
        let historychat = await historychatModels.findOne({ userId });
        if (!historychat) {
            await createChat(userId);

            historychat.messages.push({ sender: 'user', content, timestamp });
            return historychat;
        }
        historychat.messages.push({ sender: 'user', content, timestamp });
        await historychat.save();
        return historychat;
    } catch (error) {
        console.log("xin chao loi nha", error);
        throw error
    }
}
const addMessAdmin = async (chatData) => {
    try {
        const userId = chatData.room;
        const content = chatData.text;
        const timestamp = Date.now();
        const historychat = await historychatModels.findOne({ userId });
        if (!historychat) {
            await createChat(userId);
            historychat.messages.push({ sender: 'admin', content, timestamp });
            return historychat;
        }
        historychat.messages.push({ sender: 'admin', content, timestamp });
        await historychat.save();
        return historychat;
    } catch (error) {
        console.log("hello cac tinh iu", error)
    }
}

module.exports = {
    addMessUser,
    addMessAdmin,
    getHistoryChatbyUserId,
    createChat,
    getHistoryChatListAdmin
}