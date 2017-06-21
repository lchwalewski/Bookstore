var express = require('express');
var router = express.Router();
var admin_controller = require('../controllers/admin');
var index_controller = require('../controllers/index');

//pass active orders numer and check if user have admin rights on all routes
router.all('/*', admin_controller.acitveOrdersNumber, admin_controller.isAdmin, index_controller.isAdminHbsHelper);
// admin homepage
router.get('/adminhome', admin_controller.adminHome);
// view only inprogress orders
router.get('/activeorders', admin_controller.activeOrdersGet);
// change inprogress order status to canceled or done
router.post('/activeorders', admin_controller.activeOrdersPost);
// view all canceled and done orders
router.get('/orders', admin_controller.orders);
// view all books remove or edit selected
router.get('/products', admin_controller.productsGet);
// remove
router.post('/products', admin_controller.productsPost);
// edit
router.get('/editproduct/:id', admin_controller.editProductGet);
router.post('/editproduct', admin_controller.editProductPost);
// add new book to databse
router.get('/addproduct', admin_controller.addProductGet);
router.post('/addproduct', admin_controller.addProductPost);
// view only client accounts and delete selected
router.get('/showprofiles', admin_controller.showProfilesGet);

module.exports = router;