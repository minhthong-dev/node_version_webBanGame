const discountService = require('../services/discountService');

const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await discountService.getAllDiscounts();
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDiscountById = async (req, res) => {
    try {
        const discount = await discountService.getDiscountById(req.params.id);
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createDiscount = async (req, res) => {
    console.log(req.body)
    try {
        const discount = await discountService.createDiscount(req.body);
        res.status(201).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateDiscount = async (req, res) => {
    try {
        const discount = await discountService.updateDiscount(req.params.id, req.body);
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const discount = await discountService.deleteDiscount(req.params.id);
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount
}