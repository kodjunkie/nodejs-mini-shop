const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

require('dotenv').config();

const app = express();
const store = new MongoDBStore({
	uri: process.env.MONGODB_URI,
	collection: 'sessions'
});

const fileStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	}
});

const fileFilter = function(req, file, cb) {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
	session({
		secret: 'SecretKey',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			next(new Error(err));
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
	if (error) {
		console.log(error);
		return res.status(500).redirect('/500');
	}
	next();
});

mongoose
	.connect(
		process.env.MONGODB_URI,
		{ useNewUrlParser: true }
	)
	.then(() => {
		app.listen(3000);
	})
	.catch(err => console.log(err));
