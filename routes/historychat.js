const express = require('express')
const router = express.Router()
const historyChatController = require('../controllers/historyChatController')

router.get("/", historyChatController.getHistoryChatListAdmin)

router.get("/:userId", historyChatController.getHistoryChatbyUserId)

module.exports = router