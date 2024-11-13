
const mongoose = require('mongoose');
const Product = require("./product");
const Order = require("./order");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                    defaultValue: 0,
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    const updatedCart = { items: [] }

    if (!this.cart) this.cart = { items: [] };
    if (!this.cart.items) this.cart.items = [];
    updatedCart.items = [...this.cart.items];

    const existItemIndex = (this.cart?.items ?? []).findIndex(i => i.productId.toString() === product._id.toString());

    if (existItemIndex + 1) {
        const existItem = this.cart.items[existItemIndex];
        updatedCart.items[existItemIndex] = { productId: product._id, quantity: existItem.quantity + 1 };
    } else {
        updatedCart.items = [...updatedCart.items, { productId: product._id, quantity: 1 }]
    }

    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.getCart = function() {
    const productIds = this.cart.items.map(p => p.productId);

    return Product
        .find({ _id: { $in: productIds } })
        .then(products => {
            const cart = { products: [], totalPrice: 0 };
            cart.products = this.cart.items.map(item => {
                const product = products.find(p => p._id.toString() === item.productId.toString());
                const itemObject = {
                    id: product._id.toString(),
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    quantity: item.quantity,
                    totalPrice: product.price * item.quantity,
                };

                cart.totalPrice += itemObject.totalPrice;

                return itemObject;
            });

            return cart;
        })
        .catch(e => console.log(e));
};

userSchema.methods.deleteFromCart = function(productId) {
    if (this.cart && this.cart.items) {
        this.cart.items = this.cart.items.filter(i => i.productId.toString() !== productId);
    }

    return this.save();
}

userSchema.methods.addOrder = function() {
        const order = {
            items: [],
            totalPrice: 0,
            userId: this._id,
            userName: this.name,
            userEmail: this.email,
        };


        const productIds = this.cart.items.map(p => p.productId);

        return Product
            .find({ _id: { $in: productIds } })
            .then(products => {
                order.items = this.cart.items.map(item => {
                    const product = products.find(p => p._id.toString() === item.productId.toString());
                    const itemObject = {
                        productId: product._id.toString(),
                        title: product.title,
                        price: product.price,
                        quantity: item.quantity,
                        totalPrice: product.price * item.quantity,
                    };

                    order.totalPrice += itemObject.totalPrice;

                    return itemObject;
                });

                const orderInstance = new Order(order);
                return orderInstance.save().then(r => {
                    this.cart = { items: [] };
                    return this.save();
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
}








userSchema.methods.getOrders = function() {
        return Order
            .find({ userId: this._id })
            .then(dbOrders => {
                let productIds = dbOrders.map(o => o.items.map(i => i.productId)).flat();
                productIds = [...new Set(productIds)];

                return Product
                    .find({ _id: { $in: productIds } })
                    .then(products => {
                        return dbOrders.map(dbOrder => {
                            const order = { ...dbOrder, items: [] };

                            order.items = dbOrder.items.map(item => {
                                const product = products.find(p => p._id.toString() === item.productId.toString());

                                return {
                                    id: product._id.toString(),
                                    title: product.title,
                                    price: product.price,
                                    description: product.description,
                                    imageUrl: product.imageUrl,
                                    quantity: item.quantity,
                                    totalPrice: item.totalPrice,
                                };
                            })
                            return order;
                        })
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
    }

module.exports = mongoose.model("User", userSchema);
