const Wallet = require('../models/Wallet');
const WalletCategory = require('../models/WalletCategory');

const createWalletCategory = async (data) => {
    return await WalletCategory.create(data);
};

const getAllWalletCategories = async () => {
    return await WalletCategory.find();
};

const updateWalletCategory = async (id, data) => {
    return await WalletCategory.findByIdAndUpdate(id, data, { new: true });
};

const deleteWalletCategory = async (id) => {
    return await WalletCategory.findByIdAndDelete(id);
};

const createWallet = async (data) => {
    return await Wallet.create(data);
};

const getAllWallets = async () => {
    return await Wallet.find().populate('idWalletCategory');
};

const getWalletById = async (id) => {
    return await Wallet.findById(id).populate('idWalletCategory');
};

const updateWallet = async (id, data) => {
    return await Wallet.findByIdAndUpdate(id, data, { new: true });
};

const deleteWallet = async (id) => {
    return await Wallet.findByIdAndDelete(id);
};

module.exports = {
    createWalletCategory,
    getAllWalletCategories,
    updateWalletCategory,
    deleteWalletCategory,
    createWallet,
    getAllWallets,
    getWalletById,
    updateWallet,
    deleteWallet
};