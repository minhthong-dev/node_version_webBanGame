const historyService = require('../services/historyService');

exports.getHistoryById = async (req, res) => {
    const history = await historyService.getHistoryById(req.params.id);
    if (!history) {
        return res.status(404).json({ error: "history khong ton tai" });
    }
    return res.status(200).json(history);
}
exports.getAllHistory = async (req, res) => {
    const history = await historyService.getAllhistory();
    if (!history) {
        return res.status(404).json({ error: "history khong ton tai" });
    }
    return res.status(200).json(history);
}
