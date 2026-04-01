const reservationService = require('../services/reservationService');

exports.checkExpiredReservations = async () => {
    try {
        const count = await reservationService.expireReservations();
        if (count > 0) {
            console.log(`[Reservation] Đã hủy và giải phóng ${count} đơn giữ hàng hết hạn (qua 15 phút).`);
        }
    } catch (err) {
        console.error('[Reservation] Lỗi khi kiểm tra đơn hết hạn:', err);
    }
};
