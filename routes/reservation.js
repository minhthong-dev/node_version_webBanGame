const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const validateTokenExpires = require('../middlewares/validateTokenExpires');
const validateAdmin = require('../middlewares/validateAdmin');

// Bat dau giu hang (15 phut)
router.post('/', validateTokenExpires, reservationController.initiateReservation);

// Hoan tat thanh toan
router.post('/:id/pay', validateTokenExpires, reservationController.completePayment);

// Huy don giu hang dang actived
router.delete('/:id', validateTokenExpires, reservationController.cancelReservation);

// Lich su don cua user
router.get('/my', validateTokenExpires, reservationController.getMyReservations);

// Lay tat ca don (admin)
router.get('/', validateAdmin, reservationController.getAllReservations);

module.exports = router;
