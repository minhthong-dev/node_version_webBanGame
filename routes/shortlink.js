const express = require('express');
const router = express.Router();
const shortlinkController = require('../controllers/shortlinkController');

router.get('/:shortId', shortlinkController.handleShortLink);

module.exports = router;