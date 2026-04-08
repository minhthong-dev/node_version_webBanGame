const gameController = require('../controllers/gameControllers');
const express = require('express');
const router = express.Router();
const validateAdmin = require('../middlewares/validateAdmin');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/test', (req, res) => {
    res.json({ message: 'Game routes are working!' });
});
//wishlist
router.post('/wishlist', gameController.addToWishlist);

router.delete('/wishlist', gameController.removeFromWishlist);

router.get('/wishlist/:userid', gameController.getWishlistByUserId);

router.get('/wishlist/:gameId/:userId', gameController.isWishlist);
//like
router.post('/like', gameController.like);

router.delete('/unlike', gameController.unlike);

router.get('/like/count/:gameId', gameController.getLikesCount);

router.get('/like/:userid', gameController.getLikesByUserId);

router.get('/like/:gameId/:userId', gameController.isLike);

//game
router.post('/create', validateAdmin, gameController.createGame);

router.get('/all', gameController.getAllGames);

router.get('/search', gameController.searchGames);

//detail
router.get('/:id/detail', gameController.getGameDetail);

router.get('/:id', gameController.getGameById);

router.put('/:id', validateAdmin, gameController.updateGame);

router.delete('/:id', validateAdmin, gameController.deleteGame);
//upload
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

router.delete('/delete-image/:id', validateAdmin, gameController.deleteImage);


module.exports = router;