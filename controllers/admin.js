const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		validationErrors: [],
		product: {},
		hasError: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const inputs = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			validationErrors: errors.array(),
			product: inputs,
			hasError: true
		});
	}

	const product = new Product({
		title: inputs.title,
		price: inputs.price,
		description: inputs.description,
		imageUrl: inputs.imageUrl,
		userId: req.user._id
	});
	product
		.save()
		.then(() => {
			res.redirect('/');
		})
		.catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		req.redirect('/');
	}
	Product.findById(req.params.productId)
		.then(product => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/add-product',
				product,
				editing: editMode,
				validationErrors: [],
				hasError: false
			});
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const inputs = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/add-product',
			product: { ...inputs, _id: inputs.productId },
			editing: true,
			validationErrors: errors.array(),
			hasError: true
		});
	}

	Product.findById(inputs.productId)
		.then(product => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			product.title = inputs.title;
			product.price = inputs.price;
			product.description = inputs.description;
			product.imageUrl = inputs.imageUrl;
			return product.save().then(() => {
				res.redirect('/admin/products');
			});
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		.then(products => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products'
			});
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	Product.deleteOne({
		_id: req.body.productId,
		userId: req.user._id
	}).then(() => {
		res.redirect('/admin/products');
	});
};
