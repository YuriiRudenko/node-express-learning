const path = require("path");
const rootDir = require("../helpers/path");

const express = require("express");

const router = express.Router();

const shopController = require(path.join(rootDir, "controllers", "shop"));

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:id", shopController.getProduct);
router.get("/cart", shopController.getCart);
router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.postOrder);

router.post("/cart", shopController.addToCart);
router.post("/cart/delete", shopController.deleteFromCart);
module.exports = router;
