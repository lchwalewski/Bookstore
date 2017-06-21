var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var index_controller = require('../controllers/index');
var csrfProtection = csrf();

router.use(csrfProtection);
// check on all routes if user have admin rights
router.all('/', index_controller.isAdminHbsHelper);
// homepage
router.get('/', index_controller.index);
// search for books by title, author, description, publisher, genre
router.get('/search', index_controller.search);
// add book to cart
router.get('/addToCart/:id', index_controller.addToCart);
// remove selected book from cart
router.get('/removeOne/:id', index_controller.removeOne);
// view cart
router.get('/cart', index_controller.cart);
// pass cart to checkout
router.get('/checkout', index_controller.isLoggedIn, index_controller.checkoutGet);
// pay using Stripe payment method (credit card)
router.post('/checkout', index_controller.isLoggedIn, index_controller.checkoutPost);
// view books from selected genre
router.get('/genre/:genre', index_controller.genre);
// page with books on sale
router.get('/sale', index_controller.sale);
// view random book aka recommended
router.get('/recs', index_controller.recs);
// view all books added to database max 7 days ago
router.get('/fresh', index_controller.fresh);
// info about choosen book
router.get('/bookinfo/:id', index_controller.bookInfo);

module.exports = router;