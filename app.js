const path = require('path');
const rootDir = require("./helpers/path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./helpers/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const errorController = require("./controllers/error");

const app = express();

app.set('view engine', 'pug');
app.set('views', "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
   User.findAll()
   .then(users => {
       req.user = users[0];
       next();
   })
   .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.error);

Product.belongsTo(User);
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.hasMany(CartItem);
Product.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
CartItem.belongsTo(Product);
CartItem.belongsTo(Cart);

User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem);
Product.hasMany(OrderItem);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });
OrderItem.belongsTo(Product);
OrderItem.belongsTo(Order);

sequelize.sync().then(result => {
    return User.findAll();
})
.then(users => {
    if (users.length === 0)
        User.create({ name: "Yurii", email: "yurii.rudenko.work@gmail.com" });

    return Product.findAll();
})
.then(products => {
    if (products.length === 0)
        User.findAll().then(users => {
            users[0].createProduct({
                title: "Stub Product",
                price: 79.99,
                description: "My dummy product",
                imageUrl: "https://w7.pngwing.com/pngs/601/175/png-transparent-dog-dog-png-pets-image-wild-life-thumbnail.png"
            });
        })
})
.catch(err => {
    console.log(err);
});

app.listen(3000)