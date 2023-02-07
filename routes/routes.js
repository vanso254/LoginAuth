const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('../passport-config');

router.get('/', checkAuthenticated,(req, res) => {
    res.send('<h1>Home</h1>');
});

router.get('/login',checkNotAuthenticated,(req, res) => {
    res.render('login.ejs');
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.get('/error', (req, res) => {
    res.render('error.ejs');
});

router.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    req.login(req.user, (err) => {
        if (err) {
            console.log(err);
            return res.redirect('/login')
        }
        res.redirect('/');
        debugger;
    });
});

router.post('/register', async (req, res) => {
    var newUser = new User;

    newUser.fullName = req.body.fullName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    newUser.save(function (err, user) {
        if (!err) {
            console.log(user);
            res.redirect('/register');
        } else {
            res.send('error');
            console.log(err);
        }
    });
});

// Function to check if the user is authenticated
function checkAuthenticated(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // If the user is authenticated, continue with the call to next
        return next();
    }
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
}

// Function to prevent the user from going back to the login page after logging in
function checkNotAuthenticated(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        // If the user is authenticated, redirect to the home route
        return res.redirect('/');
    }
    // If the user is not authenticated, continue with the call to next
    next();
}

module.exports = router
