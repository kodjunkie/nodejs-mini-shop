const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb://127.0.0.1:27017/v8app';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'SecretKey',
	resave: false,
	saveUninitialized: false,
	store: store
}));

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		return User.findOne().then(user => {
			if (!user) {
				return new User({
					name: 'Pappy',
					email: 'pappy@demo.dev',
					cart: { items: [] }
				}).save();
			}
		});
	})
	.then(() => {
		app.listen(3000);
	})
	.catch(err => console.log(err));
