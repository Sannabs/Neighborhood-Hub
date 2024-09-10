const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');
const User = require('../models/User')
const passport = require('passport');
const router = express.Router();


// REGISTER OR SIGN UP 
router.get('/register', (req, res) => {
    res.render('users/register')
})


router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Neighborhood hub')
            res.redirect('/neighborhoods')
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))


// LOGIN THINGY
router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', storeReturnTo, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/neighborhoods';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// LOGOUT
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/neighborhoods')
    })
})


module.exports = router;