const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	items: [{
		productId: {
			title: {
				type: String,
				required: true
			},
			price: {
				type: Number,
				required: true
			},
			description: {
				type: String,
				required: true
			},
			imageUrl: {
				type: String,
				required: true
			}
		},
		quantity: {
			type: Number,
			required: true
		}
	}],
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}
});

module.exports = mongoose.model('Order', orderSchema);
