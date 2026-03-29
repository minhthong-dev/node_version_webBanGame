const express = require('express')
const router = express.Router()
const historyChatController = require('../controllers/historyChatController')
const validateAdmin = require('../middlewares/validateAdmin')

router.get("/", validateAdmin, historyChatController.getHistoryChatListAdmin)

router.get("/:userId", historyChatController.getHistoryChatbyUserId)

module.exports = router