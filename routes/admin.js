const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is_authenticated');
const adminController = require('./../controllers/admin');
const { addProductValidator, editProductValidator } = require('../middleware/validators/product_validator');

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, addProductValidator, adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, editProductValidator, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
