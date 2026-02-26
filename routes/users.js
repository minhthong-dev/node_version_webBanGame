var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const validateAdmin = require('../middlewares/validateAdmin');
const validateSuperAdmin = require('../middlewares/validateSuperAdmin');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// admin
router.get('/all', validateAdmin, async function (req, res, next) {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});
router.patch('/block/:id', validateSuperAdmin, async function (req, res, next) {
  try {
    await userController.blockUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.patch('/unblock/:id', validateSuperAdmin, async function (req, res, next) {
  try {
    await userController.unblockUser(req, res);
  } catch (error) {
    next(error);
  }
});
// auth
router.post('/register', validateUser, async function (req, res, next) {
  try {
    await userController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateUser, async function (req, res, next) {
  try {
    await userController.login(req, res);
  } catch (error) {
    next(error);
  }
});
// xac nhan email
router.get('/verify-email', async function (req, res, next) {
  try {
    await userController.verifyEmail(req, res);
  } catch (error) {
    next(error);
  }
});
// forgot password
router.post('/forgot-password', async function (req, res, next) {
  try {
    await userController.forgotPassword(req, res);
  } catch (error) {
    next(error);
  }
});
router.post('/reset-password', validateUser, async function (req, res, next) {
  try {
    await userController.resetPassword(req, res);
  } catch (error) {
    next(error);
  }
});
// payment
router.post('/payment-link'
  // , validateUser
  , async function (req, res, next) {
    try {
      await userController.createPaymentLink(req, res);
    } catch (error) {
      next(error);
    }
  });
router.post('/webhook', async function (req, res, next) {
  try {
    await userController.updateAmout(req, res);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
