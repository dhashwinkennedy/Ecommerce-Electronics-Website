const express = require("express");
const { check } = require("express-validator");
const wishlistControllers = require("../controllers/wishlist-controllers");

const router = express.Router();

router.post(
  "/",
  [check("userId").not().isEmpty()],
  wishlistControllers.getWishlistDB,
);

router.post(
  "/add",
  [check("userId").not().isEmpty(), check("productId").not().isEmpty()],
  wishlistControllers.addToWishlist,
);

router.delete(
  "/remove",
  [check("userId").not().isEmpty(), check("productId").not().isEmpty()],
  wishlistControllers.removeFromWishlist,
);

module.exports = router;
