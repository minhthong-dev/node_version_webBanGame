const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateAdmin = require('../middlewares/validateAdmin');
const validateCategories = require('../middlewares/validateCategories');
const validateTokenExpires = require('../middlewares/validateTokenExpires');
router.get('/', validateTokenExpires, async (req, res) => {
    try {
        await categoryController.getAllCategories(req, res);
    } catch (error) {
        res.status(500).json({ error: 'loi khi lay danh sach danh muc' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        await categoryController.getByIdCategories(req, res);
    } catch (error) {
        res.status(500).json({ error: 'loi khi lay danh sach danh muc' });
    }
});
router.post('/create', validateAdmin, validateCategories, async (req, res) => {
    try {
        console.log("nhan tu sever: ", req, res);
        await categoryController.createCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/:id', validateAdmin, validateCategories, async (req, res) => {
    try {
        await categoryController.updateCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', validateAdmin, async (req, res) => {
    try {
        await categoryController.deleteCategory(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
module.exports = router;