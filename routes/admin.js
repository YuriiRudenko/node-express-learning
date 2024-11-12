const router = require('express').Router();
const adminController = require(require('path').join(require('../helpers/path'), "controllers", "admin"));

router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getProducts);
router.get("/edit-product/:id", adminController.getEditProduct);

router.post("/delete-product", adminController.deleteProduct);
router.post("/edit-product", adminController.postEditProduct);

exports.routes = router;
