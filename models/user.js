const { getDb, id: ObjectId } = require("../helpers/database");

const Product = require("../models/product");

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        let op;

        if (this._id) {
            op = getDb().collection("users").updateOne({ _id: this._id }, { $set: this })
        } else {
            op = getDb().collection("users").insertOne(this)
        }

        return op.then(result => console.log(result)).catch(e => console.log(e));
    }

    addToCart(product) {
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

        return getDb()
            .collection("users")
            .updateOne(
                { _id: this._id },
                { $set: { cart: updatedCart } }
            )
            .then(result => result)
            .catch(e => console.log(e));
    }

    getCart() {

        const productIds = this.cart.items.map(p => p.productId);

        return Product
            .findAll(productIds)
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
    }

    deleteFromCart(productId) {
        if (this.cart && this.cart.items) {
            this.cart.items = this.cart.items.filter(i => i.productId.toString() !== productId);
        }

        return this.save().then(result => result).catch(e => console.log(e));
    }

    addOrder() {
        const order = {
            items: [],
            totalPrice: 0,
            userId: this._id,
            userName: this.name,
            userEmail: this.email,
        };

        const productIds = this.cart.items.map(p => p.productId);

        return Product
            .findAll(productIds)
            .then(products => {
                order.items = this.cart.items.map(item => {
                    const product = products.find(p => p._id.toString() === item.productId.toString());
                    const itemObject = {
                        id: product._id.toString(),
                        title: product.title,
                        price: product.price,
                        quantity: item.quantity,
                        totalPrice: product.price * item.quantity,
                    };

                    order.totalPrice += itemObject.totalPrice;

                    return itemObject;
                });

                return getDb()
                    .collection("orders")
                    .insertOne(order)
                    .then(result => {
                        this.cart = { items: [] };
                        return this.save().then(r => {}).catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
    }

    getOrders() {
        return getDb()
            .collection("orders")
            .find({ userId: this._id })
            .toArray()
            .then(dbOrders => {
                let productIds = dbOrders.map(o => o.items.map(i => i.id)).flat();
                productIds = [...new Set(productIds)].map(id => new ObjectId(id));

                return Product
                    .findAll(productIds)
                    .then(products => {
                        return dbOrders.map(dbOrder => {
                            const order = { ...dbOrder, items: [] };

                            order.items = dbOrder.items.map(item => {
                                const product = products.find(p => p._id.toString() === item.id.toString());

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

    static find(id) {
        return getDb()
            .collection("users")
            .find({ _id: new ObjectId(id) })
            .next()
            .then(user => user)
            .catch(e => console.log(e));
    }

    static all() {
        return getDb()
            .collection("users")
            .find()
            .toArray()
            .then(user => user)
            .catch(e => console.log(e));
    }
}

module.exports = User;