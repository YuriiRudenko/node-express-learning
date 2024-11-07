const fs = require("fs");
const path = require("path");
const rootDir = require("../helpers/path");

const FILE_PATH = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(FILE_PATH, (err, data) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) cart = JSON.parse(data);

            const productIndex = cart.products.findIndex(p => p.id === id)
            let product = cart.products[productIndex];

            if (product) {
                product.quantity += 1;
                cart.products[productIndex] = product;
                cart.products = [...cart.products];
            } else {
                product = { id: id, quantity: 1 };
                cart.products = [...cart.products, product];
            }

            cart.totalPrice = parseFloat(cart.totalPrice ?? 0) + parseFloat(price ?? 0);

            fs.writeFile(FILE_PATH, JSON.stringify(cart), (err) => console.log(err));
        })
    }

    static delete(id, price) {
        fs.readFile(FILE_PATH, (err, data) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) cart = JSON.parse(data);

            const productIndex = cart.products.findIndex(p => p.id === id)
            const product = cart.products[productIndex];

            if (product) {
                cart.products.splice(productIndex, 1);
                cart.totalPrice = parseFloat(cart.totalPrice ?? 0) - parseFloat(price ?? 0) * parseFloat(product.quantity ?? 0);
            }

            cart.products = [...cart.products];

            fs.writeFile(FILE_PATH, JSON.stringify(cart), (err) => console.log(err));
        })
    }

    static fetch(callback){
        fs.readFile(FILE_PATH, (err, data) => {
            let cart = { products: [], totalPrice: 0 };

            if (!err) cart = JSON.parse(data);

            callback(cart);
        })
    }
}