const express = require("express");
const { check } = require("express-validator");

const pageControllers = require("../controllers/page-controllers");

const router = express.Router();

router.get("/homepage", pageControllers.HomePageController);
router.get("/event/:eid", pageControllers.EventPageController);
router.get("/search", pageControllers.getSearchDB);

module.exports = router;
