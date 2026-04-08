const buyService = require('../services/buyService');

const buyGame = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await buyService.buyGame(userId);
        if (result.error) {
            const { error, ...rest } = result;
            return res.status(400).json({ error, ...rest });
        }
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

const buyWallet = async (req, res) => {
    try {
        const userId = req.user._id;
        const { walletId } = req.body;
        const result = await buyService.buyWallet(userId, walletId);
        if (result.error) {
            const { error, ...rest } = result;
            return res.status(400).json({ error, ...rest });
        }
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
}

module.exports = { buyGame, buyWallet };
