const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const user = require('../controllers/User')
const passport = require('passport');
const router = express.Router();


// REGISTER OR SIGN UP 
router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register))


// LOGIN THINGY

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }), user.login);

// LOGOUT
router.get('/logout', user.logout)


module.exports = router;