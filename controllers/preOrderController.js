const preOrderService = require('../services/preOrderService');

// POST /api/preorder
const createPreOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gameId, quantity } = req.body;

        if (!gameId) return res.status(400).json({ error: 'gameId là bắt buộc' });

        const result = await preOrderService.createPreOrder(userId, gameId, quantity);
        if (result.error) return res.status(400).json({ error: result.error });

        return res.status(201).json(result);
    } catch (error) {
        console.error('createPreOrder error:', error);
        return res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// GET /api/preorder
const getMyPreOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const preOrders = await preOrderService.getMyPreOrders(userId);
        return res.status(200).json(preOrders);
    } catch (error) {
        console.error('getMyPreOrders error:', error);
        return res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

// DELETE /api/preorder/:id
const cancelPreOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const preOrderId = req.params.id;

        const result = await preOrderService.cancelPreOrder(userId, preOrderId);
        if (result.error) return res.status(400).json({ error: result.error });

        return res.status(200).json(result);
    } catch (error) {
        console.error('cancelPreOrder error:', error);
        return res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

module.exports = { createPreOrder, getMyPreOrders, cancelPreOrder };
