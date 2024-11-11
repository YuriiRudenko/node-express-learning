const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', { docTitle: 'Add Product', path: '/admin/add-product' });
}

exports.getEditProduct = (req, res, next) => {
    Product.findByPk(req.params.id).then(product => {
        if (product) {
            res.render('admin/product-form', { product: product, docTitle: 'Edit Product', path: '/admin/edit-product' });
        } else {
            res.status(404).redirect('/not-found');
        }
    }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.id).then(product => {
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.imageUrl = req.body.imageUrl;
        return product.save();
    })
    .then(result => {
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
}

exports.deleteProduct = (req, res, next) => {
    Product.findByPk(req.body.id).then((product) => {
        return product.destroy();
    }).then(result => {
        res.redirect("/admin/products");
    }).catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    }).then(result => {
        res.redirect("/admin/products");
    }).catch(err => {
        console.log(err);
    });
}

exports.getProducts = (req, res, next) => {
    const callback =
    Product.findAll().then((products) => {
        res.render("admin/products", { docTitle: "Admin Products", products: products, path: "/admin/products" })
    }).catch(err => console.log(err));
}