const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');


router.get('/categories', walletController.getAllWalletCategories);
router.post('/categories', walletController.createWalletCategory);
router.put('/categories/:id', walletController.updateCategory);
router.delete('/categories/:id', walletController.deleteCategory);

router.get('/', walletController.getAllWallets);
router.post('/', walletController.createWallet);
router.get('/:id', walletController.getWalletById);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

module.exports = router;
