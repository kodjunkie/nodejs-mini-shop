const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('5c3e762b8a9de32b8ddf59e9')
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb://127.0.0.1:27017/v8app', { useNewUrlParser: true })
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
