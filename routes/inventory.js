const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const validateAdmin = require('../middlewares/validateAdmin');

router.post('/add-stock', validateAdmin, inventoryController.addStock);

router.get('/all', validateAdmin, inventoryController.getAllStock);

router.get('/:gameId', inventoryController.getStock);

module.exports = router;

