const historyChatService = require('../services/historyChatService')

exports.getHistoryChatbyUserId = async (req, res) => {
    try {
        const historyChat = await historyChatService.getHistoryChatbyUserId(req.params.userId);
        return res.status(200).json(historyChat);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "co van de khi lay lish su chat" });
    }
}
exports.getHistoryChatListAdmin = async (req, res) => {
    try {
        const historyChat = await historyChatService.getHistoryChatListAdmin();
        return res.status(200).json(historyChat);
    } catch (error) {
        return res.status(404).json({
            error: error.message
        })
    }
}