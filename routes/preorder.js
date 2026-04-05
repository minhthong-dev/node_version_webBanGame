const express = require('express');
const router = express.Router();
const preOrderController = require('../controllers/preOrderController');
const validateTokenExpires = require('../middlewares/validateTokenExpires');

// All routes require a valid JWT
router.post('/', validateTokenExpires, preOrderController.createPreOrder);
router.get('/', validateTokenExpires, preOrderController.getMyPreOrders);
router.delete('/:id', validateTokenExpires, preOrderController.cancelPreOrder);

module.exports = router;
