const Product = require("../models/product");
// const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product
        .all()
        .then(products => {
            res.render('shop/products', {products: products, docTitle: 'Products', path: '/products'});
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    Product
        .find(req.params.id)
        .then(product => {
            res.render('shop/product-details', { product: product, docTitle: 'product.title', path: '/product-details' });
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product
        .all()
        .then(products => {
            res.render('shop/index', { products: products, docTitle: 'Shop', path: '/' });        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            res.render('shop/cart', { path: "/cart", docTitle: "Cart", cart: cart })
        })
        .catch(e => {
            console.log(e);
            res.redirect("/");
        });
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            res.render('shop/orders', { path: '/orders', docTitle: 'Orders', orders: orders });
        })
        .catch(e => console.log(e));
}

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(r => {
            res.redirect("/orders");
        })
        .catch(e => console.log(e));
}

exports.addToCart = (req, res, next) => {
    Product
        .find(req.body.id)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => res.redirect("/cart"))
        .catch(e => console.log(e));
}

exports.deleteFromCart = (req, res, next) => {
    req.user
        .deleteFromCart(req.body.id)
        .then(() => res.redirect("/cart"))
        .catch(e => console.log(e));
}
