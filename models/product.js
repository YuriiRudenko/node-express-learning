const fs = require("fs");
const path = require("path");
const rootDir = require("../helpers/path");
const Cart = require("./cart");

const FILE_PATH = path.join(rootDir, 'data', 'products.json');

const getProducts = (callback) => {
    fs.readFile(FILE_PATH, (err, fileContent) => {
        let products = [];
        if (!err) {
            products = JSON.parse(fileContent);
        }
        return callback(products);
    })
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
        getProducts(products => {
            // const updatedProducts = [...products];

            if (this.id) {
                const index = products.findIndex(p => p.id === this.id);
                products[index] = this;
            } else {
                this.id = ((Math.max.apply(null, products.map(p => p.id)) ?? 0) + 1).toString();
                products.push(this);
            }
            fs.writeFile(FILE_PATH, JSON.stringify(products), (err) => console.log(err))
        })
    }

    static delete(id) {
        getProducts(products => {
            const index = products.findIndex(p => p.id === id);
            const product = products[index];
            products.splice(index, 1);
            fs.writeFile(FILE_PATH, JSON.stringify(products), (err) => {
                if (!err) {
                    Cart.delete(id, product.price);
                }
            })
        })
    }

    static fetchAll(callback) {
        getProducts(callback);
    }

    static find(id, callback) {
        getProducts(products => {
            const product = products.find(product => product.id === id);
            callback(product);
        })
    }
}