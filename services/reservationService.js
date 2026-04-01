const Inventory = require('../models/Inventory');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Game = require('../models/Game');
const historyService = require('./historyService');
const emailService = require('./emailService');
const socketApi = require('../config/socket');
const crypto = require('crypto');
const cartService = require('./cartService');

const HOLD_MINUTES = 15;

// Bat dau giu hang (15 phut)
const initiateReservation = async (userId, gameId, quantity = 1) => {
    const user = await User.findById(userId);
    if (!user) return { error: 'Người dùng không tồn tại' };

    const game = await Game.findById(gameId);
    if (!game) return { error: 'Game không tồn tại' };

    const existingReservation = await Reservation.findOne({ userId, gameId, status: 'actived' });
    if (existingReservation) {
        return { error: 'Bạn đã có đơn đặt chờ thanh toán cho game này', reservationId: existingReservation._id };
    }

    const totalPrice = game.price * quantity;
    if (user.amount < totalPrice) {
        return { error: `Số dư không đủ. Cần ${totalPrice}, bạn đang có ${user.amount}` };
    }

    const inventory = await Inventory.findOneAndUpdate(
        {
            gameId,
            $expr: { $gte: [{ $subtract: ['$stock', '$reserved'] }, quantity] }
        },
        { $inc: { reserved: quantity } },
        { new: true }
    );

    if (!inventory) {
        const inv = await Inventory.findOne({ gameId });
        if (!inv) return { error: 'Sản phẩm này chưa có thông tin tồn kho' };
        return { error: `Không đủ hàng. Còn lại: ${inv.stock - inv.reserved} sản phẩm` };
    }

    const expiredIn = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
    const reservation = new Reservation({ userId, gameId, quantity, totalPrice, expiredIn });
    await reservation.save();

    return {
        success: true,
        reservation,
        message: `Hàng đã được giữ trong ${HOLD_MINUTES} phút. Vui lòng hoàn tất thanh toán trước ${expiredIn.toISOString()}`
    };
};

// Hoan tat thanh toan
const completePayment = async (reservationId, userId) => {
    const reservation = await Reservation.findOne({ _id: reservationId, userId });
    if (!reservation) return { error: 'Đơn đặt không tồn tại hoặc không thuộc về bạn' };

    if (reservation.status !== 'actived') {
        return { error: `Không thể thanh toán đơn ở trạng thái: ${reservation.status}` };
    }

    if (new Date() > reservation.expiredIn) {
        reservation.status = 'expired';
        await reservation.save();
        await Inventory.findOneAndUpdate(
            { gameId: reservation.gameId },
            { $inc: { reserved: -reservation.quantity } }
        );
        return { error: 'Đơn đặt đã hết hạn (15 phút). Vui lòng đặt lại' };
    }

    const user = await User.findById(userId);
    if (!user) return { error: 'Người dùng không tồn tại' };

    if (user.amount < reservation.totalPrice) {
        return { error: `Số dư không đủ. Cần ${reservation.totalPrice}, bạn đang có ${user.amount}` };
    }

    user.amount -= reservation.totalPrice;
    await historyService.createHistory(userId, 'buying', reservation.totalPrice, [reservation.gameId]);
    await user.save();

    await Inventory.findOneAndUpdate(
        { gameId: reservation.gameId },
        { $inc: { stock: -reservation.quantity, reserved: -reservation.quantity } }
    );

    reservation.status = 'completed';
    await reservation.save();

    socketApi.io.to(userId.toString()).emit('buy_success', 'update_amount');

    const game = await Game.findById(reservation.gameId);
    if (game) {
        const gameKey = crypto.randomBytes(8).toString('hex').toUpperCase();
        await emailService.sendBuyGameSuccessEmail(user.email, [{ name: game.name, key: gameKey }]);
        await cartService.removeFromCart(userId, reservation.gameId.toString());
    }

    return { success: true, reservation, message: 'Thanh toán thành công!' };
};

// Huy don giu hang
const cancelReservation = async (reservationId, userId) => {
    const reservation = await Reservation.findOne({ _id: reservationId, userId });
    if (!reservation) return { error: 'Đơn đặt không tồn tại hoặc không thuộc về bạn' };

    if (reservation.status !== 'actived') {
        return { error: `Chỉ có thể hủy đơn hàng đang ở trạng thái actived` };
    }

    await Inventory.findOneAndUpdate(
        { gameId: reservation.gameId },
        { $inc: { reserved: -reservation.quantity } }
    );

    reservation.status = 'expired';
    await reservation.save();

    return { success: true, message: 'Đã hủy đơn hàng và trả hàng vào kho' };
};

const getMyReservations = async (userId, status) => {
    const filter = { userId };
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter)
        .populate('gameId', 'name price media')
        .sort({ createdAt: -1 });

    return { success: true, reservations };
};

const getAllReservations = async ({ status, page = 1, limit = 20 }) => {
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [reservations, total] = await Promise.all([
        Reservation.find(filter)
            .populate('userId', 'username email')
            .populate('gameId', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Reservation.countDocuments(filter)
    ]);

    return {
        success: true,
        reservations,
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
    };
};

// Cron: giai phong hang qua 15 phut
const expireReservations = async () => {
    const expiredReservations = await Reservation.find({
        status: 'actived',
        expiredIn: { $lt: new Date() }
    });

    if (expiredReservations.length === 0) return 0;

    const groupedByGame = {};
    for (const r of expiredReservations) {
        const key = r.gameId.toString();
        groupedByGame[key] = (groupedByGame[key] || 0) + r.quantity;
    }

    const bulkOps = Object.entries(groupedByGame).map(([gameId, totalQty]) => ({
        updateOne: {
            filter: { gameId },
            update: { $inc: { reserved: -totalQty } }
        }
    }));
    await Inventory.bulkWrite(bulkOps);

    const resIds = expiredReservations.map(o => o._id);
    const result = await Reservation.updateMany(
        { _id: { $in: resIds } },
        { $set: { status: 'expired' } }
    );

    return result.modifiedCount;
};

module.exports = {
    initiateReservation,
    completePayment,
    cancelReservation,
    getMyReservations,
    getAllReservations,
    expireReservations
};
