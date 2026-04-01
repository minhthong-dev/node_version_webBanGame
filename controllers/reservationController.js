const reservationService = require('../services/reservationService');

// POST /api/reservations - Tao don va giu hang (15 phut)
const initiateReservation = async (req, res) => {
    const { gameId, quantity } = req.body;
    const userId = req.user._id;

    if (!gameId) return res.status(400).json({ error: 'gameId là bắt buộc' });

    const result = await reservationService.initiateReservation(userId, gameId, quantity || 1);
    if (result.error) return res.status(400).json({ error: result.error, reservationId: result.reservationId });
    return res.status(201).json(result);
};

// POST /api/reservations/:id/pay - Hoan tat thanh toan
const completePayment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await reservationService.completePayment(id, userId);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json(result);
};

// DELETE /api/reservations/:id - Huy don
const cancelReservation = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await reservationService.cancelReservation(id, userId);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.status(200).json(result);
};

// GET /api/reservations/my - Lich su don cua user
const getMyReservations = async (req, res) => {
    const userId = req.user._id;
    const { status } = req.query;

    const result = await reservationService.getMyReservations(userId, status);
    return res.status(200).json(result);
};

// GET /api/reservations - Admin xem list don
const getAllReservations = async (req, res) => {
    const { status, page, limit } = req.query;
    const result = await reservationService.getAllReservations({ status, page, limit });
    return res.status(200).json(result);
};

module.exports = {
    initiateReservation,
    completePayment,
    cancelReservation,
    getMyReservations,
    getAllReservations
};
