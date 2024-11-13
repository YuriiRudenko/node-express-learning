const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/products', {products: products, docTitle: 'Products', path: '/products'});
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    Product
        .findById(req.params.id)
        .then(product => {
            res.render('shop/product-details', { product: product, docTitle: 'product.title', path: '/product-details' });
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/index', { products: products, docTitle: 'Shop', path: '/' });
        })
        .catch(err => {
                console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(usr => {
            console.log(usr.cart.items);
            const totalPrice = usr.cart.items.map(i => i.quantity * i.productId.price).reduce((a, b) => a + b, 0)
            res.render('shop/cart', { path: "/cart", docTitle: "Cart", cart: usr.cart, totalPrice: totalPrice })
        })
        .catch(e => {
            console.log(e);
        });
}

exports.getOrders = (req, res, next) => {
    Order
        .find({ userId: req.user })
        .populate('items.productId')
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
        .findById(req.body.id)
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
