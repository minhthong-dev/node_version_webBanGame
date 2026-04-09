var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const validateAdmin = require('../middlewares/validateAdmin');
const validateSuperAdmin = require('../middlewares/validateSuperAdmin');
const passport = require('passport');
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
// auth — GET hints (browser/Postman GET otherwise hits 404 with HTML)
router.get('/register', function (req, res) {
  res.status(405).json({
    error: 'Phương thức không đúng: cần POST, không phải GET',
    method: 'POST',
    url: '/api/users/register',
    body: { username: 'string', email: 'string', password: 'string' }
  });
});
router.get('/login', function (req, res) {
  res.status(405).json({
    error: 'Phương thức không đúng: cần POST, không phải GET',
    method: 'POST',
    url: '/api/users/login',
    body: { loginKey: 'email hoặc username', password: 'string' }
  });
});

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
// oauth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.oauthCallBack);
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
router.get('/amount/:userId', async function (req, res, next) {
  try {
    await userController.getAmount(req, res);
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
// reset mat khau
router.patch('/update-pass', async function (req, res, next) {
  try {
    await userController.updatePass(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/update-pass-request', validateUser, async function (req, res, next) {
  try {
    await userController.updatePassRequest(req.userId, res);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
