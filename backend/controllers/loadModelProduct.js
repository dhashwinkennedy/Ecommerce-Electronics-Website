const HttpError = require("../models/http-error");
const modelProduct = require("../models/modelProduct.js");

const loadProduct = async (PID) => {
  let modelDB;
  try {
    modelDB = await modelProduct.findById(PID); // ✅ use findById instead of find
  } catch (err) {
    throw new Error("Something went wrong!");
  }

  if (!modelDB) {
    // ✅ works correctly with findById
    throw new Error("Product not found");
  }

  return modelDB;
};

exports.loadProduct = loadProduct;
