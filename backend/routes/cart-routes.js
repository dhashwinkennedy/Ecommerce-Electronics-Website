const express = require("express");
const { check } = require("express-validator");
const cartControllers = require("../controllers/cart-controllers");

const router = express.Router();
router.post("/", [check("userId").not().isEmpty()], cartControllers.getCartDB);
router.post(
  "/add",
  [
    check("userId").not().isEmpty(),
    check("productId").not().isEmpty(),
    check("qty").isInt({ min: 1 }),
  ],
  cartControllers.addToCart,
);
router.patch(
  "/update",
  [
    check("userId").not().isEmpty(),
    check("productId").not().isEmpty(),
    check("qty").isInt({ min: 1 }),
  ],
  cartControllers.updateCartItem,
);

router.delete(
  "/remove",
  [check("userId").not().isEmpty(), check("productId").not().isEmpty()],
  cartControllers.removeFromCart,
);
module.exports = router;
