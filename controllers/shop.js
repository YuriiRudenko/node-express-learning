const Product = require('../models/product');
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    const callback = (products) => {
        res.render('shop/products', { products: products, docTitle: 'Products', path: '/products' });
    };

    Product.fetchAll(callback);
}

exports.getProduct = (req, res, next) => {
    const callback = (product) => {
        res.render('shop/product-details', { product: product, docTitle: product.title, path: '/product-details' });
    };

    Product.find(req.params.id, callback);
}

exports.getIndex = (req, res, next) => {
    const callback = (products) => {
        res.render('shop/index', { products: products, docTitle: 'Shop', path: '/' });
    };

    Product.fetchAll(callback);
}

exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        Cart.fetch((cart) => {
            const items = [];

            const cartObject = { products: [], totalPrice: 0 };

            let index = 1;

            cart.products.forEach(cartProduct => {
                const productData = products.find(p => p.id === cartProduct.id);
                if (productData) {
                    const item = {
                        ...productData,
                        index: index,
                        quantity: cartProduct.quantity,
                        totalPrice: parseFloat(productData.price) * parseFloat(cartProduct.quantity)
                    }

                    items.push(item);
                    cartObject.products = items;
                    cartObject.totalPrice = Math.round(cart.totalPrice, 2);

                    index += 1;
                }
            })

            res.render('shop/cart', { path: '/cart', docTitle: 'Cart', cart: cartObject });
        })
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', docTitle: 'Orders' });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', docTitle: 'Checkout' });
}

exports.addToCart = (req, res, next) => {
    Product.find(req.body.id, (product) => {
        Cart.addProduct(product.id, product.price);
        res.redirect("/cart");
    });

}

exports.deleteFromCart = (req, res, next) => {
    Product.find(req.body.id, (product) => {
        Cart.delete(product.id, product.price);
        res.redirect("/cart");
    })
}