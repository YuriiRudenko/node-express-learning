const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', { docTitle: 'Add Product', path: '/admin/add-product' });
}

exports.getEditProduct = (req, res, next) => {
    Product.find(req.params.id, (product) => {
        if (product) {
            res.render('admin/product-form', { product: product, docTitle: 'Edit Product', path: '/admin/edit-product' });
        } else {
            res.status(404).redirect('/not-found');
        }
    })
}

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.id, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect("/admin/products");
}

exports.deleteProduct = (req, res, next) => {
    Product.delete(req.body.id);
    res.redirect("/admin/products");
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect("/admin/products");
}

exports.getProducts = (req, res, next) => {
    const callback = (products) => {
        res.render("admin/products", { docTitle: "Admin Products", products: products, path: "/admin/products" })
    }
    Product.fetchAll(callback);
}