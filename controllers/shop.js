const Product = require('../models/product');
const Order = require('../models/order');

const errorHandler = require('../util/error_handler')

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products'
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.getProduct = (req, res, next) => {
	Product.findById(req.params.productId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products'
			});
		}).catch(err => errorHandler(err, next));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/'
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.getCart = (req, res, next) => {
	req.user.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const cartProducts = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.postCart = (req, res, next) => {
	const inputs = req.body;
	Product.findById(inputs.productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => errorHandler(err, next));
};

exports.postDeleteCartItem = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product => {
			return req.user.deleteFromCart(product);
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => errorHandler(err, next));
};

exports.getOrders = (req, res, next) => {
	Order.find().where('user', req.user._id)
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				orders: orders,
				pageTitle: 'Your Orders'
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.postCreateOrder = (req, res, next) => {
	req.user.addOrder()
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => errorHandler(err, next));
};

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };
