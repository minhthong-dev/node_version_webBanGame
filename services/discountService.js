const { errorMonitor } = require('nodemailer/lib/xoauth2');
const discountModel = require('../models/Discount');
const gameModel = require('../models/Game')
const getAllDiscounts = async () => {
    try {
        const discounts = await discountModel.find();
        return discounts;
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách mã giảm giá');
    }
}

const getDiscountById = async (id) => {
    try {
        const discount = await discountModel.findById(id);
        if (discount) {
            return discount;
        }
        else {
            throw new Error('Không tìm thấy mã giảm giá');
        }
    } catch (error) {
        throw new Error('Lỗi khi lấy mã giảm giá');
    }
}
const createDiscount = async (discountData) => {
    try {
        const discount = new discountModel(discountData);
        const gameExitDiscount = await discountModel.find({
            //isActive: true,
            $or: [
                { categoriesId: { $in: discountData.categoriesId } },
                { gamesId: { $in: discountData.gamesId } }
            ]
        });

        if (gameExitDiscount.length > 0) {
            throw new Error('Mã giảm giá đã tồn tại');
        }
        await discount.save();
        return discount;
    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}

const updateDiscount = async (id, discountData) => {
    try {
        const discount = await discountModel.findByIdAndUpdate(id, discountData, { new: true });
        if (discount) {
            return discount;
        }
        else {
            throw new Error('Không tìm thấy mã giảm giá');
        }
    } catch (error) {
        throw new Error('Lỗi khi cập nhật mã giảm giá');
    }
}

const deleteDiscount = async (id) => {
    try {
        const discount = await discountModel.findByIdAndDelete(id);
        if (discount) {
            return discount;
        }
        else {
            throw new Error('Không tìm thấy mã giảm giá');
        }
    } catch (error) {
        throw new Error('Lỗi khi xóa mã giảm giá');
    }
}
const checkIsGameDiscount = async (id) => {
    try {
        const game = await gameModel.findById(id).select('genre').lean();
        if (!game) return false;
        const discount = await discountModel.findOne({
            isActive: true,
            $or: [
                { categoriesId: { $in: game.genre } },
                { gamesId: id.toString() }
            ]
        }).lean();

        return discount || false;
    } catch (error) {
        console.error('Error in checkIsGameDiscount:', error);
        return false;
    }
}
module.exports = {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    checkIsGameDiscount
}