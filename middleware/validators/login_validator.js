const { check, body } = require('express-validator/check');

const User = require('../../models/user');

module.exports = [
	check('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.normalizeEmail()
		.trim()
		.custom((value, { req }) => {
			return User.findOne({ email: value }).then(userDoc => {
				if (!userDoc) {
					return Promise.reject(new Error('Your credentials do not match our records!'));
				}
				return Promise.resolve(true);
			});
		}),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Your password should contain atleast 6 characters')
];
