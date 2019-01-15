const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const inputs = req.body;
    const product = new Product(
        inputs.title, inputs.price, inputs.description, inputs.imageUrl, null, req.user._id
    );
    product.save().then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        req.redirect('/');
    }
    Product.findById(req.params.productId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/add-product',
                product,
                editing: editMode
            });
        })
        .catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
    const inputs = req.body;
    const product = new Product(
        inputs.title, inputs.price, inputs.description, inputs.imageUrl, req.body.productId
    );
    product.update()
        .then(() => {
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteById(req.body.productId)
        .then(() => {
            res.redirect('/admin/products');
        });
};
