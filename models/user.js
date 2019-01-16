const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = require('./order');

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [{
			productId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'Product'
			},
			quantity: {
				type: Number,
				required: true
			}
		}]
	}
}, { timestamps: false });

userSchema.methods.addToCart = function (product) {
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];
	const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({ productId: product._id, quantity: newQuantity });
	}

	const updatedCart = { items: updatedCartItems };
	this.cart = updatedCart;

	return this.save();
};

userSchema.methods.deleteFromCart = function (product) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productId.toString() !== product._id.toString();
	});
	this.cart.items = updatedCartItems;

	return this.save();
};

userSchema.methods.addOrder = function () {
	return this.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const order = {
				items: user.cart.items,
				user: this._id
			};
			return new Order(order).save();
		}).then(() => {
			this.cart.items = [];
			return this.save();
		});
};

module.exports = mongoose.model('User', userSchema);
