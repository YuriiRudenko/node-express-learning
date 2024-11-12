const path = require('path');
const rootDir = require("./helpers/path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");
const mongoConnect = require("./helpers/database").mongoConnect;

const User = require("./models/user");

const app = express();

app.set('view engine', 'pug');
app.set('views', "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
    User
        .all()
        .then(users => {
            const user = users[0];
            req.user = new User(user.name, user.email, user.cart, user._id);
            next()
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.error);

mongoConnect(() => {
    app.listen(3000)
});