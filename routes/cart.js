const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', (req, res) => {
    return res.status(200).json({ message: 'concac' });
});

module.exports = router;