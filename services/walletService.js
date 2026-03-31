const Wallet = require('../models/Wallet');
const WalletCategory = require('../models/WalletCategory');

const createWalletCategory = async (name) => {
    return await WalletCategory.create({ name });
};

const getAllWalletCategories = async () => {
    return await WalletCategory.find();
};

const updateWalletCategory = async (id, name) => {
    return await WalletCategory.findByIdAndUpdate(id, { name }, { new: true });
};

const deleteWalletCategory = async (id) => {
    return await WalletCategory.findByIdAndDelete(id);
};

const createWallet = async (data) => {
    return await Wallet.create(data);
};

const getAllWallets = async () => {
    return await Wallet.find().populate('categoryId');
};

const getWalletById = async (id) => {
    return await Wallet.findById(id).populate('categoryId');
};

const updateWallet = async (id, data) => {
    return await Wallet.findByIdAndUpdate(id, data, { new: true });
};

const deleteWallet = async (id) => {
    return await Wallet.findByIdAndDelete(id);
};
