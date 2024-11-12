const Product = require("../models/product");
const ObjectId = require("../helpers/database").id;

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', { docTitle: 'Add Product', path: '/admin/add-product' });
}

exports.getEditProduct = (req, res, next) => {
    Product
        .find(req.params.id)
        .then(product => {
            res.render('admin/product-form', {product: product, docTitle: 'Edit Product', path: '/admin/edit-product'});
        })
        .catch(err => {
            res.status(404).redirect('/not-found');
        });
}

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, req.body.id);

    product.save()
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => {
        console.log(err);
    });
}

exports.deleteProduct = (req, res, next) => {
    Product
        .delete(req.body.id)
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl, null, req.user._id);
    product.save()
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    Product
        .all()
        .then(products => {
            res.render("admin/products", { docTitle: "Admin Products", products: products, path: "/admin/products" });
        })
        .catch(err => {
            console.log(err);
        });
}