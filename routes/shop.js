const express = require('express');

const isAuth = require('../middleware/is_authenticated');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postDeleteCartItem);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/orders/:orderId', isAuth, shopController.getOrderInvoice);

module.exports = router;
