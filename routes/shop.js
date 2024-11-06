const path = require("path");
const rootDir = require("../helpers/path");

const express = require("express");

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res, next) => {
    console.log(adminData.products);
    res.render('shop', { products: adminData.products, docTitle: 'Shop' });
});

module.exports = router;
