const path = require("path");
const rootDir = require("../helpers/path");
const express = require("express");

const router = express.Router();

const adminController = require(path.join(rootDir, "controllers", "admin"));

router.get("/products", adminController.getProducts);
router.get("/add-product", adminController.getAddProduct);
router.get("/edit-product/:id", adminController.getEditProduct);
router.post("/delete-product", adminController.deleteProduct);

router.post("/add-product", adminController.postAddProduct);
router.post("/edit-product", adminController.postEditProduct);

exports.routes = router;
