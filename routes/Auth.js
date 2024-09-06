const express = require('express');
// const AuthController = require('../controllers/AuthController');

const {
    postRegister,
    getRegister,
    postLogin,
    getLogin
} = require('../controllers/AuthController');
const router = express.Router();

router.post('/register', postRegister);
// router.get('/register',  getRegister);

router.post('/login', postLogin);
// router.get('/login', getLogin);
module.exports = router;
