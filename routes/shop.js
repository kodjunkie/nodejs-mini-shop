const express = require('express');

const isAuthenticated = require('../middleware/is_authenticated');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthenticated, shopController.getCart);

router.post('/cart', isAuthenticated, shopController.postCart);

router.post('/cart-delete-item', isAuthenticated, shopController.postDeleteCartItem);

router.get('/orders', isAuthenticated, shopController.getOrders);

router.post('/create-order', isAuthenticated, shopController.postCreateOrder);

router.get('/orders/:orderId', isAuthenticated, shopController.getOrderInvoice);

module.exports = router;
