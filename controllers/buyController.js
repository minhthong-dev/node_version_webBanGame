const buyService = require('../services/buyService');
const buyGame = async (req, res) => {
    const { userId, amount, gameId } = req.body;
    const result = await buyService.buyGame(userId, amount, gameId);
    if (result.error) {
        console.log('loi roi cac ban oi: ', result.error);
        return res.status(400).json({ error: 'loi roi cac ban oi' });
    }
    return res.status(200).json({ success: true });
}
module.exports = {
    buyGame
}