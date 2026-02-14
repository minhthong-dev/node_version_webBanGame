const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateAdmin = require('../middlewares/validateAdmin');
router.get('/', async (req, res) => {
    try {
        await categoryController.getAllCategories(req, res);
    } catch (error) {
        res.status(500).json({ error: 'loi khi lay danh sach danh muc' });
    }
});
router.post('/create',validateAdmin, async (req, res) => {
    try {
        await categoryController.createCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/:id',validateAdmin, async (req, res) => {
    try {
        await categoryController.updateCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/:id',validateAdmin, async (req, res) => {
    try {
        await categoryController.deleteCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
module.exports = router;