const HttpError = require("../models/http-error");
const modelProduct = require("../models/modelProduct");
const searchProduct = require("../models/searchProduct");

const HomePageController = async (req, res, next) => {
  const productIds = [
    "EEPIDL217882361",
    "EEPIDL262423935",
    "EEPIDL674835435",
    "EEPIDM251527934",
    "EEPIDM520936763",
    "EEPIDM396649221",
    "EEPIDM265466775",
    "EEPIDL745860524",
  ];

  let homeDB;
  try {
    homeDB = await modelProduct.find({ _id: { $in: productIds } });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find products.", 500),
    );
  }

  const best_deals = [
    "EEPIDM396649221",
    "EEPIDM265466775",
    "EEPIDL745860524",
    "EEPIDL745860524",
    "EEPIDL745860524",
    "EEPIDL745860524",
    "EEPIDL745860524",
    "EEPIDL745860524",
    "EEPIDL745860524",
  ];
  const resultDB = { "best deals": [] };
  // in HomePageController
  best_deals.forEach((id) => {
    const item = homeDB.find((p) => p._id.toString() === id);
    if (item) {
      const obj = item.toObject({ getters: true });
      resultDB["best deals"].push({
        ...obj,
        img_address: `/images/product_images/${obj._id}/img.jpg`, // ✅
      });
    }
  });

  res.json(resultDB);
};

const EventPageController = async (req, res, next) => {
  const eventId = req.params.eid;

  let productIds;
  if (eventId === "mobile-mania") {
    productIds = [
      "EEPIDL217882361",
      "EEPIDL262423935",
      "EEPIDL674835435",
      "EEPIDM251527934",
      "EEPIDM520936763",
      "EEPIDM396649221",
      "EEPIDM265466775",
      "EEPIDL745860524",
    ];
  } else if (eventId === "premium-sale") {
    productIds = [
      "EEPIDL217882361",
      "EEPIDL262423935",
      "EEPIDL674835435",
      "EEPIDM251527934",
      "EEPIDM520936763",
      "EEPIDM396649221",
      "EEPIDM265466775",
      "EEPIDL745860524",
    ];
  } else if (eventId === "lapfest") {
    productIds = [
      "EEPIDL217882361",
      "EEPIDL262423935",
      "EEPIDL674835435",
      "EEPIDM251527934",
      "EEPIDM520936763",
      "EEPIDM396649221",
      "EEPIDM265466775",
      "EEPIDL745860524",
    ];
  } else {
    return next(
      new HttpError("Could not find event for the provided id.", 404),
    );
  }

  let eventDB;
  try {
    eventDB = await modelProduct.find({ _id: { $in: productIds } });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find products.", 500),
    );
  }

  const resultDB = { "day deals": [], "festive deals": [] };

  // ✅ splice mutates the array, slice does not
  const dayDealIds = productIds.splice(0, 4);
  dayDealIds.forEach((id) => {
    const item = eventDB.find((p) => p._id.toString() === id);
    if (item) {
      const obj = item.toObject({ getters: true });
      resultDB["day deals"].push({
        ...obj,
        img_address: `/images/product_images/${obj._id}/img.jpg`, // ✅
      });
    }
  });

  productIds.forEach((id) => {
    const item = eventDB.find((p) => p._id.toString() === id);
    if (item) {
      const obj = item.toObject({ getters: true });
      resultDB["festive deals"].push({
        ...obj,
        img_address: `/images/product_images/${obj._id}/img.jpg`, // ✅
      });
    }
  });

  res.json(resultDB);
};
const getSearchDB = async (req, res, next) => {
  const { q } = req.query;
  if (!q) return next(new HttpError("Search query is required.", 400));

  let searchDB;
  try {
    searchDB = await searchProduct.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
  } catch (err) {
    return next(new HttpError("Something went wrong.", 500));
  }

  if (!searchDB || searchDB.length === 0) {
    return next(new HttpError("No products found.", 404));
  }

  // ✅ generate img_address from _id
  res.json({
    products: searchDB.map((p) => ({
      ...p.toObject({ getters: true }),
      img_address: `/images/product_images/${p._id}/img.jpg`,
    })),
  });
};
exports.HomePageController = HomePageController;
exports.EventPageController = EventPageController;
exports.getSearchDB = getSearchDB;
