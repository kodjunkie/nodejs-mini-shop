const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator/check');

const errorHandler = require('../util/error_handler');
const User = require('../models/user');

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: req.flash('error'),
		oldInput: { email: '' },
		validationErrors: []
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: { email: email },
			validationErrors: errors.array()
		});
	}

	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid email or password!');
				return res.redirect('/login');
			}
			return bcrypt
				.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							if (err) {
								console.log(err);
							}
							return res.redirect('/');
						});
					}
					req.flash('error', 'Invalid email or password!');
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
					res.redirect('/login');
				});
		})
		.catch(err => errorHandler(err, next));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: req.flash('error'),
		oldInput: { email: '' },
		validationErrors: []
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			oldInput: { email: email },
			validationErrors: errors.array()
		});
	}
	bcrypt
		.hash(password, 12)
		.then(hashedPassword => {
			const user = new User({
				email: email,
				password: hashedPassword,
				cart: { items: [] }
			});
			return user.save();
		})
		.then(user => {
			res.redirect('/login');
			return sgMail.send(
				{
					to: email,
					from: process.env.MAIL_FROM,
					subject: 'Signup Successful',
					html: '<h2>You signed up successfully...</h2>'
				},
				false,
				(err, response) => {
					if (err) {
						console.log(err);
					}
				}
			);
		})
		.catch(err => {
			return errorHandler(err, next);
		});
};

exports.getReset = (req, res, next) => {
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: req.flash('error')
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash('error', 'No account with this credentials!');
					return res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then(() => {
				res.redirect('/');
				sgMail.send(
					{
						to: req.body.email,
						from: process.env.MAIL_FROM,
						subject: 'Password reset Link',
						html: `
						<p>You requested a password reset!</p>
						<p>Click this <a href='http://localhost:3000/reset/${token}'>link to set a new password.</a></p>
					`
					},
					false,
					(err, response) => {
						if (err) {
							console.log(err);
						}
					}
				);
			})
			.catch(err => errorHandler(err, next));
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() }
	})
		.then(user => {
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'New Password',
				errorMessage: req.flash('error'),
				userId: user._id.toString(),
				passwordToken: token
			});
		})
		.catch(err => errorHandler(err, next));
};

exports.postNewPassword = (req, res, next) => {
	const inputs = req.body;
	let userObj;
	User.findOne({
		resetToken: inputs.passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: inputs.userId
	})
		.then(user => {
			userObj = user;
			return bcrypt.hash(inputs.password, 12);
		})
		.then(hashedPassword => {
			userObj.password = hashedPassword;
			userObj.resetToken = undefined;
			userObj.resetTokenExpiration = undefined;
			return userObj.save();
		})
		.then(user => {
			res.redirect('/login');
		})
		.catch(err => errorHandler(err, next));
};
