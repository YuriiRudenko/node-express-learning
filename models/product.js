const Cart = require("./cart");
const db = require("../helpers/database");

const SQL = {
    insert: "INSERT INTO products(title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
    update: "UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?",
    find: "SELECT * FROM products WHERE id = ? LIMIT 1",
    all: "SELECT * FROM products",
    delete: "DELETE FROM products WHERE id = ?"
};

const getProducts = (callback) => {
    db.exec(SQL.all, [], callback);
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        const args = [this.title, this.price, this.description, this.imageUrl];

        if (this.id) {
            Product.find(this.id, product => {
                db.exec(SQL.update, [...args, this.id]);
            })
        } else {
            db.exec(SQL.insert, args);
        }
    }

    static delete(id) {
        Product.find(id, (product) => {
            db.exec(SQL.delete, [id], () => Cart.delete(product.id, product.price))
        })
    }

    static fetchAll(callback) {
        getProducts(callback);
    }

    static find(id, callback) {
        db.exec(SQL.find, [id], products => callback(products[0]))
    }
}