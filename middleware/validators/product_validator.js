const { body } = require('express-validator/check');

const Product = require('../../models/product');

exports.addProductValidator = [
	body('title')
		.trim()
		.isString()
		.withMessage('Title must be string.')
		.custom((value, { req }) => {
			return Product.findOne({
				title: value.trim(),
				userId: req.user._id
			}).then(product => {
				if (product) {
					return Promise.reject(new Error('You already own a product with thesame name.'));
				}
				return Promise.resolve(true);
			});
		}),
	body('imageUrl')
		.trim()
		// .isURL()
		.withMessage('Image Url must be valid.'),
	body('price')
		.trim()
		.isDecimal()
		.withMessage('Price must be decimal.'),
	body('description', 'Description must be string with minimum 3 characters')
		.trim()
		.isString()
		.isLength({ min: 3, max: 400 })
];

exports.editProductValidator = [
	body('title')
		.trim()
		.isString()
		.withMessage('Title must be string.')
		.custom((value, { req }) => {
			return Product.findOne({
				_id: req.body.productId,
				userId: req.user._id
			}).then(product => {
				if (!product) {
					return Promise.reject(new Error('You do not have the permission to edit this product.'));
				}
				if (value.length < 1) {
					return Promise.reject(new Error('Title must not be empty.'));
				}
				return Promise.resolve(true);
			});
		}),
	body('imageUrl')
		.trim()
		// .isURL()
		.withMessage('Image Url must be valid.'),
	body('price')
		.trim()
		.isDecimal()
		.withMessage('Price must be decimal.'),
	body('description', 'Description must be string with minimum 3 characters')
		.trim()
		.isString()
		.isLength({ min: 3, max: 400 })
];
