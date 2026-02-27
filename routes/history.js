var express = require('express');
var router = express.Router();
const historyController = require('../controllers/historyController');
const validateAdmin = require('../middlewares/validateAdmin');

router.get('/:id', historyController.getHistoryById);
router.get('/', validateAdmin, historyController.getAllHistory);

module.exports = router;
