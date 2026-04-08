const Inventory = require('../models/Inventory');
const User = require('../models/User');
const Game = require('../models/Game');

// POST /api/inventory/add-stock - Tao hoac cap nhat ton kho (Dung cho test Postman)
// stock: so nguyen >= 0 (0 hop le cho pre-order / het hang)
// mode: "increment" (mac dinh) = cong them; "set" = dat tuyet doi ton kho
const addStock = async (req, res) => {
    try {
        const { gameId, quantity, mode = 'increment' } = req.body;

        const qty = Number(quantity);
        if (!gameId || !Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0) {
            return res.status(400).json({
                error: 'gameId là bắt buộc; stock phải là số nguyên >= 0 (0 được phép cho pre-order)'
            });
        }

        if (mode !== 'increment' && mode !== 'set') {
            return res.status(400).json({ error: 'mode phải là "increment" hoặc "set"' });
        }

        // 2. Kiểm tra Game có tồn tại không
        const existingGame = await Game.findById(gameId);
        if (!existingGame) {
            return res.status(404).json({ error: 'Game không tồn tại. Không thể thêm kho.' });
        }

        const update =
            mode === 'set'
                ? { $set: { stock: qty } }
                : { $inc: { stock: qty } };

        const inventory = await Inventory.findOneAndUpdate({ gameId }, update, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });

        const message =
            mode === 'set'
                ? `Đã đặt tồn kho = ${qty} cho game`
                : qty === 0
                  ? 'Không thay đổi số lượng (cộng 0); tồn kho hiện tại giữ nguyên'
                  : `Đã thêm ${qty} sản phẩm vào kho cho game`;

        return res.status(200).json({
            success: true,
            message,
            totalStock: inventory.stock,
            mode
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID Game không đúng định dạng' });
        }
        return res.status(500).json({ error: err.message });
    }
};

const getStock = async (req, res) => {
    try {
        const { gameId } = req.params;
        const inventory = await Inventory.findOne({ gameId });
        if (!inventory) return res.status(404).json({ error: 'Không tìm thấy inventory' });
        return res.status(200).json(inventory);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getAllStock = async (req, res) => {
    try {
        const inventories = await Inventory.find()
            .populate('gameId', 'name price media genre');
        const result = inventories.map(inv => ({
            _id: inv._id,
            game: inv.gameId,
            stock: inv.stock,
            reserved: inv.reserved,
            available: inv.stock - inv.reserved,
            updatedAt: inv.updatedAt
        }));
        return res.status(200).json({ total: result.length, data: result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { addStock, getStock, getAllStock };
