const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const errorHandler = require('../util/error_handler');
const { ITEMS_PER_PAGE } = require('../util/constants');

exports.getProducts = (req, res, next) => {
	const page = Number.parseInt(req.query.page) || 1;
	let totalItems;

	Product.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then(products => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
				totalProducts: totalItems,
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
		})
		.catch(err => errorHandler(err, next));
};

exports.getIndex = (req, res, next) => {
	const page = Number.parseInt(req.query.page) || 1;
	let totalItems;

	Product.countDocuments()
		.then(numProducts => {
			totalItems = numProducts;
			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE);
		})
		.then(products => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				totalProducts: totalItems,
				currentPage: page,
				hasNextPage: ITEMS_PER_PAGE * page < totalItems,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
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
	Order.find()
		.where('user', req.user._id)
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
	req.user
		.addOrder()
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => errorHandler(err, next));
};

exports.getOrderInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error('No order found!'));
			}

			if (order.user.toString() !== req.user._id.toString()) {
				return next(new Error('Unauthoried!'));
			}

			const pdf = new PDFDocument();
			const invoiceName = 'invoice-' + orderId + '.pdf';
			const invoicePath = path.join('data', 'invoices', invoiceName);

			pdf.pipe(fs.createWriteStream(invoicePath));
			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
			pdf.pipe(res);

			pdf.fontSize(26).text('Invoice');
			pdf.fontSize(14).text('------------------------');

			let totalPrice = 0;
			order.items.forEach(item => {
				totalPrice = totalPrice + item.productId.price * item.quantity;
				pdf.fontSize(14).text(item.productId.title + ' - $' + item.productId.price + ' x ' + item.quantity);
			});

			pdf.text('------------------------');
			pdf.text('Total: $' + Math.round(totalPrice));
			pdf.end();
		})
		.catch(err => next(err));
};
