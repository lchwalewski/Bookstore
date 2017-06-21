var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var User = require('../models/user');
var Product = require('../models/product');
var Order = require('../models/order');
var Handlebars = require('handlebars');

Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
exports.adminHome = function(req, res, next) {
    res.render('admin/adminhome', {
        user: req.user
    });
};
exports.activeOrdersGet = function(req, res, next) {
    Order.find(function(err, orders) {
        if (err) {
            console.log(err);
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('admin/activeorders', {
            user: req.user,
            orders: orders
        });
    }).populate('user').sort([
        ['create_date', 'descending']
    ]);
};
exports.activeOrdersPost = function(req, res, next) {
    var orderId = req.body.id;
    Order.findById(orderId, function(err, order) {
        if (err) {
            console.log(err);
        }
        order.status = req.body.status;
        order.save();
        res.redirect('/admin/activeorders');
    });

};
exports.orders = function(req, res, next) {
    Order.find(function(err, orders) {
        if (err) {
            console.log(err);
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('admin/orders', {
            user: req.user,
            orders: orders
        });
    }).populate('user').sort([
        ['create_date', 'descending']
    ]);
};
exports.productsGet = function(req, res, next) {
    Product.find(function(err, products) {
        if (err) {
            console.log(err);
        }
        var productsChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < products.length; i += chunkSize) {
            productsChunks.push(products.slice(i, i + chunkSize));
        }
        res.render('admin/products', {
            products: productsChunks,
            user: req.user
        });
    });
};
exports.productsPost = function(req, res, next) {
    var productId = req.body.id;
    Product.findById(productId, function(err, product) {
        if (err) {
            console.log(err);
        }
        product.remove();
        console.log(product.id + ' ' + product.title + ' deleted');
        res.redirect('/admin/products');
    });

};
exports.editProductGet = function(req, res, next) {
    Product.findOne({ _id: req.params.id }, function(err, product) {
        if (err) {
            console.log(err);
        }
        res.render('admin/editproduct', {
            product: product,
            user: req.user
        });
    });
    console.log(req.params.id);
};
exports.editProductPost = function(req, res, next) {
    var productId = req.body.id;
    Product.findOne({ _id: productId }, function(err, product) {
        if (err) {
            console.log(err);
        } else {
            product.image = req.body.image;
            product.title = req.body.title;
            product.author = req.body.author;
            product.description = req.body.description;
            product.publisher = req.body.publisher;
            product.year = req.body.year;
            product.price = req.body.price;
            product.genre = req.body.genre;
            product.isbn = req.body.isbn;
            product.promo = req.body.promo;
            product.save(function(err) {
                if (err) {
                    res.render('admin/editproduct', {
                        product: product,
                        msg: err
                    });
                } else {
                    res.redirect('/admin/products');
                }
            });
        }
    });
};
exports.addProductGet = function(req, res, next) {
    res.render('admin/addproduct', {
        user: req.user
    });
};
exports.addProductPost = function(req, res, next) {
    var product = new Product({
        image: req.body.image,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        publisher: req.body.publisher,
        year: req.body.year,
        price: req.body.price,
        genre: req.body.genre,
        isbn: req.body.isbn
    });
    product.save(function(err) {
        if (err) {
            console.log(err);
            res.render('admin/addproduct', {
                msg: err
            });

        } else {
            res.redirect("/admin/products");
        }

    });

};
exports.showProfilesGet = function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
        }
        var usersChunks = [];
        var chunkSize = 1;
        for (var i = 0; i < users.length; i += chunkSize) {
            usersChunks.push(users.slice(i, i + chunkSize));
        }
        res.render('admin/showprofiles', {
            users: usersChunks,
            user: req.user
        });
    });
};
exports.showProfilesPost = function(req, res, next) {
    var userId = req.body.id;
    User.findByIdAndRemove(userId, function(err, user) {
        if (err) {
            console.log(err);
        }
        console.log('User deleted');
        res.redirect('/admin/showprofiles');
    });

};

exports.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        var userId = req.user.id;
        User.findById(userId, function(err, user) {
            if (user.role === 'admin') {
                return next();
            }
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
};
exports.acitveOrdersNumber = function(req, res, next) {
    Order.count({ status: 'inprogress' }, function(err, c) {
        if (err) {
            console.log(err);
        }
        Handlebars.registerHelper('number', function() {
            return new Handlebars.SafeString(c);
        });
    });
    next();
};