const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const validateAdmin = require('../middlewares/validateAdmin');

router.post('/add-stock', validateAdmin, inventoryController.addStock);

module.exports = router;
