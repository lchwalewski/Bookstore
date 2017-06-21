var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var user_controller = require('../controllers/user');
var index_controller = require('../controllers/index');
var csrfProtection = csrf();

router.use(csrfProtection);
router.all('/*', index_controller.isAdminHbsHelper);
// view account informations
router.get('/profile', user_controller.isLoggedIn, user_controller.profile);
// view info to update do so or cancel
router.get('/updateprofile', user_controller.isLoggedIn, user_controller.updateProfileGet);
router.post('/updateprofile', user_controller.isLoggedIn, user_controller.updateProfilePost);
// view  orders history
router.get('/history', user_controller.isLoggedIn, user_controller.history);
router.get('/logout', user_controller.isLoggedIn, user_controller.logout);
// check if user is not logged in, !! use only before routes where u know its true !!
router.use('/', user_controller.notLoggedIn, function(req, res, next) {
    next();
});
// register new account
router.get('/register', user_controller.registerGet);
router.post('/register', passport.authenticate('local.signup', {
    failureRedirect: '/user/register',
    failureFlash: true
}), user_controller.registerPost);
// login to exisitng account
router.get('/login', user_controller.loginGet);
router.post('/login', passport.authenticate('local.signin', {
    failureRedirect: '/user/login',
    failureFlash: true
}), user_controller.loginPost);

module.exports = router;