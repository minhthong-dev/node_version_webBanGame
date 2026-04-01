const Inventory = require('../models/Inventory');
const User = require('../models/User');

// POST /api/inventory/add-stock - Tao hoac cap nhat ton kho (Dung cho test Postman)
const addStock = async (req, res) => {
    try {
        const { gameId, stock } = req.body;
        if (!gameId || typeof stock !== 'number') {
            return res.status(400).json({ error: 'gameId và stock là bắt buộc' });
        }
        
        // Them moi hoac cap nhat stock
        const inventory = await Inventory.findOneAndUpdate(
            { gameId },
            { $set: { stock } },
            { new: true, upsert: true }
        );
        
        return res.status(200).json({ success: true, inventory });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { addStock };
