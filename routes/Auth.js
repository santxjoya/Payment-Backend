const express = require('express');
// const AuthController = require('../controllers/AuthController');

const {
    postRegister,
    getRegister,
    postLogin,
    getLogin,
    postForgotPassword,
    postResetPassword,
    postVerifyCode,
 
    

    
} = require('../controllers/AuthController');
const router = express.Router();

router.post('/register', postRegister);
// router.get('/register',  getRegister);

router.post('/login', postLogin);
// router.get('/login', getLogin);
router.post('/Forgot-Password', postForgotPassword);
router.post('/verify-code', postVerifyCode);
router.post('/reset-password', postResetPassword);
module.exports = router;
