const discountModel = require('../models/Discount');

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

        await discount.save();
        return discount;
    } catch (error) {
        console.log(error)
        throw new Error('Lỗi khi tạo mã giảm giá');
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
module.exports = {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount
}