const express = require('express');

const authController = require('../controllers/auth');
const signupValidator = require('../middleware/validators/signup_validator');
const loginValidator = require('../middleware/validators/login_validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', loginValidator, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', signupValidator, authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
