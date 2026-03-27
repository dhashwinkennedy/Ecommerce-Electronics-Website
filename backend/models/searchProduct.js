const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const searchProductSchema = new Schema({
  name: { type: String, required: true },
  img_address: { type: String },
  price: { type: Number },
  rating: { type: Number },
  org_price: { type: Number },
  discount: { type: Number },
  total_rating: { type: Number },
  category: { type: String },
  brand: { type: String },
  OS: { type: String },
  processor: { type: String },
  ram: { type: String },
  graphics: { type: String },
  storage: { type: String },
  display: { type: String },
  softwares: { type: String },
  refresh_rate: { type: String },
});

searchProductSchema.index({ name: "text", brand: "text", category: "text" });

module.exports = mongoose.model(
  "SearchProduct",
  searchProductSchema,
  "searchPageProduct",
);
