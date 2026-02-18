const gameController = require('../controllers/gameControllers');
const express = require('express');
const router = express.Router();
const validateAdmin = require('../middlewares/validateAdmin');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/test', (req, res) => {
    res.json({ message: 'Game routes are working!' });
});

router.post('/create', validateAdmin, gameController.createGame);

router.get('/all', gameController.getAllGames);

router.get('/search', gameController.searchGames);

router.get('/:id', gameController.getGameById);

router.put('/:id', validateAdmin, gameController.updateGame);

router.delete('/:id', validateAdmin, gameController.deleteGame);

router.post(
    '/upload-cover',
    upload.single('image'),
    validateAdmin,
    gameController.uploadCoverImage
);

router.post(
    '/upload-screenshot',
    upload.fields([{ name: 'images', maxCount: 5 }]),
    validateAdmin,
    gameController.uploadScreenshotImage
);

router.delete('/delete-image', validateAdmin, gameController.deleteImage);

module.exports = router;