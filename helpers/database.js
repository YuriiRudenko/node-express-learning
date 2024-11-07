const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'password',
});

exports.connection = connection;

exports.exec = (sql, vars, callback) => {
    connection.execute(sql, vars, (err, res, fields) => {
        if (err) {
            console.log(err);
        } else if (callback) {
            callback(res);
        } else {
            console.log(res);
        }
    })
}