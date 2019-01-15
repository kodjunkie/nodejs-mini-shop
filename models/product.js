const mongodb = require('mongodb');
const {getDb} = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }

    update() {
        const db = getDb();
        return db.collection('products').updateOne({_id: this._id}, {$set: this});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(productId) {
        const db = getDb();
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(productId)}).next();
    }

    static deleteById(productId) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(productId)});
    }
}

module.exports = Product;
