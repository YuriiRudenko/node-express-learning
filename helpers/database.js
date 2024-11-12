const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb://localhost:27017/node-complete")
        .then(client => {
            _db = client.db();
            callback();
        })
        .catch(e => console.log(e));
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database connection";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
exports.id = mongodb.ObjectId;