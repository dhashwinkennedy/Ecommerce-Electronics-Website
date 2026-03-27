const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/user-controllers");

const router = express.Router();

// ✅ get user
router.get("/:uid", userControllers.getUser);

// ✅ login
router.post("/login", userControllers.login);

// ✅ signup
router.post(
  "/signup",
  [
    check("firstName").not().isEmpty().isLength({ min: 2, max: 30 }),
    check("surname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").not().isEmpty().isNumeric().isLength({ min: 10, max: 10 }),
    check("password").isLength({ min: 6 }),
    check("dob").not().isEmpty().isDate(),
  ],
  userControllers.signup,
);

// ✅ update — no password needed
router.patch(
  "/update",
  [
    check("UID").not().isEmpty(),
    check("firstName").not().isEmpty().isLength({ min: 2, max: 30 }),
    check("surname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phone").not().isEmpty().isNumeric().isLength({ min: 10, max: 10 }),
    check("dob").not().isEmpty().isDate(),
  ],
  userControllers.updateAccount,
);

// ✅ delete
router.post(
  "/delete",
  [check("UID").not().isEmpty(), check("password").isLength({ min: 6 })],
  userControllers.deleteAccount,
);

module.exports = router;
