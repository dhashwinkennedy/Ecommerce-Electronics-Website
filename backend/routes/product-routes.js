const express = require("express");
const router = express.Router();
const productController = require("../controllers/product-controller");

// GET /api/product/:pid?userId=EEUID123
router.get("/:pid", productController.getProductPage);

module.exports = router;
