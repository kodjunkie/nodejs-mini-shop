const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity});
        }

        const updatedProduct = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedProduct}});
    }

    deleteFromCart(product) {
        const existingProductIndex = this.cart.items
            .findIndex(item => item.productId.toString() === product._id.toString());
        const updatedCartItems = this.cart.items.slice(0, existingProductIndex, 1);
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}});
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => item.productId);
        return db.collection('products').find({_id: {$in: productIds}}).toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity
                    };
                });
            }).then(products => {
                const updatedCartItems = products.map(product => {
                    return {productId: product._id, quantity: product.quantity};
                });
                db.collection('users').updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}});

                return products;
            });
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(cartItems => {
            const order = {
                items: cartItems,
                user: {
                    _id: this._id,
                    name: this.name
                }
            };
            return db.collection('orders').insertOne(order);
        }).then(() => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: this._id}, {$set: {cart: this.cart}});
        });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({"user._id": this._id}).toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;
