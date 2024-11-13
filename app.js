const path = require('path');
const rootDir = require("./helpers/path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");
const mongoConnect = require("./helpers/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");

// const User = require("./models/user");

const app = express();

app.set('view engine', 'pug');
app.set('views', "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
    User.findOne()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(e => console.log(e))
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.error);

mongoose.connect("mongodb://localhost:27017/node-complete")
    .then(() => {
        User
            .findOne()
            .then(dbUser => {
                let user = dbUser;
                if (!user) {
                    user = new User({ name: "Yurii", email: "yurii.rudenko.work@gmail.com", cart: { items: [] } });
                    user.save();
                }

            });
        app.listen(3000)
    })
    .catch(e => console.log(e));