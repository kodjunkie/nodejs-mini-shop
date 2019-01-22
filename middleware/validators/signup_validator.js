const { check, body } = require('express-validator/check');

const User = require('../../models/user');

module.exports = [
	check('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then(userDoc => {
				if (userDoc) {
					return Promise.reject(new Error('E-mail already exists, please pick a different one!'));
				}
				return Promise.resolve(true);
			});
		}),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Your password should contain atleast 6 characters'),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Your password do not match, please try again');
		}
		return true;
	})
];
