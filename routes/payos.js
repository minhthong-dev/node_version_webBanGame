const express = require('express')
const router = express.Router();
const rawPaymentController = require('../controllers/rawPaymentController');
const validateAdmin = require('../middlewares/validateAdmin');

router.get('/', validateAdmin, rawPaymentController.getAllRawPayment);

router.get('/success', rawPaymentController.successPayment);

router.get('/cancel', rawPaymentController.cancelPayment);

module.exports = router;
