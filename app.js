const path = require('path');
const rootDir = require("./helpers/path");

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./helpers/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();

app.set('view engine', 'pug');
app.set('views', "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.error);

app.listen(3000)