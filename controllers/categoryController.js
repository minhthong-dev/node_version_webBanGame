const categoryService = require('../services/categoryService');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'loi khi lay danh sach danh muc' });
    }
}
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await categoryService.createCategory(name);
        res.status(201).json({ sussecc: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedCategory = await categoryService.updateCategory(id, name);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoryService.deleteCategory(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}