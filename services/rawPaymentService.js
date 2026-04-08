const RawPayment = require('../models/RawPayment');

const createRawPayment = async (paymentData) => {
    try {
        const rawPayment = new RawPayment(paymentData);
        return await rawPayment.save();
    } catch (error) {
        console.error("Lỗi khi lưu RawPayment:", error);
        return { error: error.message };
    }
};

const getRawPaymentByOrderCode = async (paymentLinkId) => {
    try {
        return await RawPayment.findOne({ paymentLinkId });
    } catch (error) {
        console.error("Lỗi khi tìm RawPayment:", error);
        return null;
    }
};

const getAllRawPayment = async () => {
    try {
        return await RawPayment.find().populate('description');
    } catch (error) {
        console.error("Lỗi khi tìm RawPayment:", error);
        return null;
    }
};

const updateRawPaymentStatus = async (paymentLinkId, status) => {
    try {
        return await RawPayment.findOneAndUpdate(
            { paymentLinkId },
            { status },
            { new: true }
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái RawPayment:", error);
        return null;
    }
};

module.exports = {
    createRawPayment,
    getRawPaymentByOrderCode,
    updateRawPaymentStatus,
    getAllRawPayment
};
