const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-form', { docTitle: 'Add Product', path: '/admin/add-product' });
}

exports.getEditProduct = (req, res, next) => {
    Product
        .findById(req.params.id)
        .then(product => {
            res.render('admin/product-form', {product: product, docTitle: 'Edit Product', path: '/admin/edit-product'});
        })
        .catch(err => {
            res.status(404).redirect('/not-found');
        });
}

exports.postEditProduct = (req, res, next) => {
    const { title, description, price, imageUrl } = req.body;
    const args = { title, description, price, imageUrl };
    Product
        .findOneAndUpdate({ _id: req.body.id }, args)
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => {
        console.log(err);
    });
}

exports.deleteProduct = (req, res, next) => {
    Product
        .deleteOne({ _id: req.body.id })
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => console.log(err));
}

exports.postAddProduct = (req, res, next) => {
    const { title, price, description, imageUrl } = req.body;
    const product = new Product({ title, price, description, imageUrl, userId: req.user._id });
    product.save()
        .then(result => {
            res.redirect("/admin/products");
        }).catch(err => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render("admin/products", { docTitle: "Admin Products", products: products, path: "/admin/products" });
        })
        .catch(err => {
            console.log(err);
        });
}