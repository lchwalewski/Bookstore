var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');
var Handlebars = require('handlebars');

Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
exports.profile = function(req, res, next) {
    var userId = req.user.id;
    User.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
        }
        res.render('user/profile', {
            user: req.user
        });
    });
};
exports.updateProfileGet = function(req, res, next) {
    res.render('user/updateprofile', {
        csrfToken: req.csrfToken(),
        user: req.user
    });
};
exports.updateProfilePost = function(req, res, next) {
    var userId = req.user.id;
    var messages = req.flash('error');
    User.findById(userId, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            user.email = req.body.email;
            user.firstName = req.body.firstN;
            user.lastName = req.body.lastN;
            user.password = user.encryptPassword(req.body.password);
            user.city = req.body.city;
            user.street = req.body.street;
            user.buildingNumber = req.body.building;
            user.flatNumber = req.body.flat;
            user.phoneNumber = req.body.phone;
            user.save(function(err) {
                if (err) {
                    res.render('user/updateprofile', {
                        user: req.user,
                        csrfToken: req.csrfToken(),
                        messages: messages,
                        hasErrors: messages.length > 0,
                        msg: err
                    });
                } else {
                    res.redirect('/user/profile');
                }
            });
        }

    });
};
exports.history = function(req, res, next) {
    Order.find({
        user: req.user
    }, function(err, orders) {
        if (err) {
            console.log(err);
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/history', {
            orders: orders,
            user: req.user
        });
    }).sort([
        ['create_date', 'descending']
    ]);
};
exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

exports.registerGet = function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/register', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        user: req.user
    });
};
exports.registerPost = function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
};
exports.loginGet = function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/login', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        user: req.user
    });
};
exports.loginPost = function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
};


exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

exports.notLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};