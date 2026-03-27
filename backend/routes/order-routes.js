const express = require("express");
const { check } = require("express-validator");
const orderControllers = require("../controllers/order-controllers");

const router = express.Router();

router.post("/", check("userId").not().isEmpty(), orderControllers.getOrderDB);
router.post(
  "/new",
  [
    check("userId").not().isEmpty(),
    check("productId").not().isEmpty(),
    check("price").isNumeric(),
    check("qty").isInt({ min: 1 }),
    check("paymentMode").not().isEmpty(),
  ],
  orderControllers.newOrder,
);

router.patch(
  "/update-payment",
  [
    check("userId").not().isEmpty(),
    check("orderId").not().isEmpty(),
    check("paymentMode").not().isEmpty(),
  ],
  orderControllers.updatePayment,
);

router.patch(
  "/cancel",
  [check("userId").not().isEmpty(), check("orderId").not().isEmpty()],
  orderControllers.cancelOrder,
);

module.exports = router;
