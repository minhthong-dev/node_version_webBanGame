
const walletService = require('../services/walletService');

exports.createWalletCategory = async (req, res) => {
    try {
        const newCategory = await walletService.createWalletCategory(req.body);
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllWalletCategories = async (req, res) => {
    try {
        const categories = await walletService.getAllWalletCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await walletService.updateWalletCategory(req.params.id, req.body);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await walletService.deleteWalletCategory(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Wallet Routes
exports.createWallet = async (req, res) => {
    try {
        const newWallet = await walletService.createWallet(req.body);
        res.status(201).json({ success: true, data: newWallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllWallets = async (req, res) => {
    try {
        const wallets = await walletService.getAllWallets();
        res.status(200).json(wallets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateWallet = async (req, res) => {
    try {
        const updatedWallet = await walletService.updateWallet(req.params.id, req.body);
        res.status(200).json(updatedWallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteWallet = async (req, res) => {
    try {
        await walletService.deleteWallet(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
