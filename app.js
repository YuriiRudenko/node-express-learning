const path = require('path');
const rootDir = require("./helpers/path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.set('view engine', 'pug');
app.set('views', "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use("/", (req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000)