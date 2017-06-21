var express = require('express');
var router = express.Router();
var passport = require('passport');
var Handlebars = require('handlebars');
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

exports.index = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    res.render('shop/index', {
        title: 'myBook',
        successMsg: successMsg,
        noMessages: !successMsg,
        user: req.user
    });
};
exports.search = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    var query = req.query.searchquery;
    Product.find({ $text: { $search: query } }, { score: { $meta: "textScore" } }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            var productChunks = [];
            var chunkSize = 4;
            for (var i = 0; i < docs.length; i += chunkSize) {
                productChunks.push(docs.slice(i, i + chunkSize));
            }
            console.log(productChunks);
            res.render('shop/books', {
                title: 'Bookstore',
                products: productChunks,
                successMsg: successMsg,
                noMessages: !successMsg,
                user: req.user
            });
        }
    }).sort({ score: { $meta: "textScore" } });
};
exports.addToCart = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {
        items: {}
    });

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('404');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);

        res.redirect('/genre/' + product.genre);
    });
};
exports.removeOne = function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {
        items: {}
    });
    cart.removeOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
};

exports.cart = function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/cart', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        user: req.user
    });
};

exports.checkoutGet = function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {
        csrfToken: req.csrfToken(),
        total: cart.totalPrice,
        errMsg: errMsg,
        noErrors: !errMsg,
        user: req.user
    });
};
exports.checkoutPost = function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require('stripe')("sk_test_3tBEC0tUJTur6fm7NqEKHF1U");
    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "pln",
        source: req.body.stripeToken,
        description: "Test charge"
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Dokonano zakupu!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
};
exports.genre = function(req, res, next) {
    var genre = req.params.genre;
    var successMsg = req.flash('success')[0];
    Product.find({ genre: genre }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/books', {
            products: productChunks,
            successMsg: successMsg,
            noMessages: !successMsg,
            genre: genre,
            user: req.user
        });
    }).sort([
        ['create_date', 'descending']
    ]);
};
exports.sale = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({ promo: true }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/books', {
            products: productChunks,
            successMsg: successMsg,
            noMessages: !successMsg,
            user: req.user
        });
    });
};
exports.recs = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.count().exec(function(err, count) {
        var random = Math.floor(Math.random() * count);
        Product.findOne().skip(random).exec(
            function(err, doc) {
                res.render('shop/bookinfo', {
                    product: doc,
                    successMsg: successMsg,
                    noMessages: !successMsg,
                    user: req.user
                });
            });
    });
};
exports.fresh = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find({
        create_date: {
            $gte: new Date(new Date().getTime() - /*60 * 5 * 1000*/ 604800000).toISOString()
        }
    }, function(err, docs) {
        var productChunks = [];
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/books', {
            products: productChunks,
            successMsg: successMsg,
            noMessages: !successMsg,
            user: req.user
        });
    });
};
exports.bookInfo = function(req, res, next) {
    var successMsg = req.flash('success')[0];
    var productId = req.params.id;
    Product.findById(productId, function(err, doc) {
        res.render('shop/bookinfo', {
            product: doc,
            successMsg: successMsg,
            noMessages: !successMsg,
            user: req.user
        });
    });

};
exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/login');
};

exports.notLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
exports.isAdminHbsHelper = function(req, res, next) {
    // hbs helper check if user have admin status
    Handlebars.registerHelper('isAdmin', function(conditional, options) {
        if (conditional === 'admin') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    next();
};