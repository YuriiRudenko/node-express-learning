const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    req.user.getProducts().then((products) => {
        res.render('shop/products', { products: products, docTitle: 'Products', path: '/products' });
    });
}

exports.getProduct = (req, res, next) => {
    req.user.getProducts({ where: { id: req.params.id }}).then((products) => {
        res.render('shop/product-details', { product: products[0], docTitle: 'product.title', path: '/product-details' });
    });
}

exports.getIndex = (req, res, next) => {
    req.user.getProducts().then((products) => {
        res.render('shop/index', { products: products, docTitle: 'Shop', path: '/' });
    });
}

exports.getCart = (req, res, next) => {
    Cart.findOrCreate({
        where: {
            userId: req.user.id
        }
    }).then(r => {
        req.user.getCart().then(cart => {
            cart.getProducts().then(products => {
                const totalPrice = products.map(p => p.price * p.cartItem.quantity).reduce((a, b) => a + b, 0);
                res.render('shop/cart', { path: "/cart", docTitle: "Cart", products: products, totalPrice: totalPrice });
            })
        })
    })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] }).then((orders) => {
        res.render('shop/orders', { path: '/orders', docTitle: 'Orders', orders: orders });
    })
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }))
                })
                .catch(e => console.log(e))
        })
        .then(r => {
            return fetchedCart.setProducts(null);
        })
        .then(r => {
            res.redirect("/orders");
        })
        .catch(e => console.log(e))
}

exports.addToCart = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: req.body.id } });
        })
        .then(products => {
            let product = products[0];
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                newQuantity += product.cartItem.quantity;
            }
            return Product.findByPk(req.body.id).then(product => {
                return fetchedCart.addProduct(product, {
                    through: { quantity: newQuantity }
                })
            })
            .then(() => res.redirect("/cart"))
            .catch(err => console.log(err));
        })
}

exports.deleteFromCart = (req, res, next) => {
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart
        return cart.getProducts({ where: { id: req.body.id } })
    }).then(products => {
        let product = products[0];
        if (product && product.cartItem) {
            return product.cartItem.destroy();
        }
    }).then(r => {
        res.redirect("/cart")
    }).catch(err => console.log(err));
}
