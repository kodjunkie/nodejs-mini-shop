const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/is_authenticated');
const adminController = require('./../controllers/admin');

router.get('/add-product', isAuthenticated, adminController.getAddProduct);

router.post('/add-product', isAuthenticated, adminController.postAddProduct);

router.get('/products', isAuthenticated, adminController.getProducts);

router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);

router.post('/edit-product', isAuthenticated, adminController.postEditProduct);

router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

module.exports = router;
