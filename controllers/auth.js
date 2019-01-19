const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: false
	});
};

exports.postLogin = (req, res, next) => {
	User.findById('5c3e762b8a9de32b8ddf59e9')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				console.log(err);
				res.redirect('/');
			});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		isAuthenticated: false
	});
};

exports.postSignup = (req, res, next) => {

};
