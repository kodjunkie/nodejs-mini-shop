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
    req.user.createProduct({
        title: inputs.title,
        imageUrl: inputs.imageUrl,
        description: inputs.description,
        price: inputs.price
    }).then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        req.redirect('/');
    }
    Product.findByPk(req.params.productId)
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
    Product.update({
            title: inputs.title,
            imageUrl: inputs.imageUrl,
            description: inputs.description,
            price: inputs.price
        },
        {
            where: {
                id: req.body.productId
            }
        }).then(() => {
        res.redirect('/admin/products')
    });
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
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
    Product.destroy({
        where: {
            id: req.body.productId
        }
    }).then(() => {
        res.redirect('/admin/products');
    });
};
