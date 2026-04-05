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

const getRawPaymentByOrderCode = async (orderCode) => {
    try {
        return await RawPayment.findOne({ orderCode });
    } catch (error) {
        console.error("Lỗi khi tìm RawPayment:", error);
        return null;
    }
};

const updateRawPaymentStatus = async (orderCode, status) => {
    try {
        return await RawPayment.findOneAndUpdate(
            { orderCode },
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
    updateRawPaymentStatus
};
