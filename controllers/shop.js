const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
				isAuthenticated: false
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
	Product.findById(req.params.productId)
		.then(product => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
				isAuthenticated: false
			});
		}).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				isAuthenticated: false
			});
		})
		.catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
	req.user.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const cartProducts = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProducts,
				isAuthenticated: false
			});
		})
		.catch(err => console.log(err));
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
		.catch(err => console.log(err));
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
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	Order.find().where('user', req.user._id)
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				orders: orders,
				pageTitle: 'Your Orders',
				isAuthenticated: false
			});
		})
		.catch(err => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
	req.user.addOrder()
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };
