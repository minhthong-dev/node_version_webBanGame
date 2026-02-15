var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const validateAdmin = require('../middlewares/validateAdmin');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',validateUser, async function(req, res, next) {
  try {
    await userController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login',validateUser ,async function(req, res, next) {
  try {
    await userController.login(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/all',validateAdmin,async function(req, res, next) {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});
router.get('/verify-email', async function(req, res, next) {
  try {
    await userController.verifyEmail(req, res);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
