const getDb = require("../helpers/database").getDb;
const ObjectId = require("../helpers/database").id;


class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id && new ObjectId(id);
        this.userId = userId;
    }

    save() {
        let op;

        if (this._id) {
            op = getDb().collection("products").updateOne({ _id: this._id }, { $set: this })
        } else {
            op = getDb().collection("products").insertOne(this)
        }

        return op.then(result => console.log(result)).catch(e => console.log(e));
    }

    static all() {
        return getDb()
            .collection("products")
            .find()
            .toArray()
            .then(products => products)
            .catch(e => console.log(e));
    }

    static find(id) {
        return getDb()
            .collection("products")
            .find({ _id: new ObjectId(id) })
            .next()
            .then(product => product)
            .catch(e => console.log(e));
    }

    static findAll(ids) {
        return getDb()
            .collection("products")
            .find({ _id: { $in: ids } })
            .toArray()
            .then(products => products)
            .catch(e => console.log(e));
    }

    static delete(id) {
        return getDb()
            .collection("products")
            .deleteOne({ _id: new ObjectId(id) })
            .then(result => result)
            .catch(e => console.log(e));
    }

    static update(id, attrs) {
        return getDb()
            .collection("products")
            .updateOne({ _id: new ObjectId(id) }, { $set: attrs })
            .then(result => result)
            .catch(e => console.log(e));
    }
}

module.exports = Product;