const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    org_price: { type: Number, required: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    total_rating: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    charger: { type: Number, default: 0 },
    model_series: { type: String, default: null },
    model_number: { type: String, default: null },
    purpose: { type: String, default: null },
    addon: { type: String, default: null },
    benefits: { type: String, default: null },

    // ✅ flexible — fields vary between laptop/mobile/Apple
    processor: { type: Object, default: null },
    GPU: { type: Object, default: null },
    ram: { type: Object, default: null },
    storage: { type: Object, default: null },
    display: { type: Object, default: null },
    OS: { type: Object, default: null },
    slots: { type: Object, default: null },
    network: { type: Object, default: null },
    power: { type: Object, default: null },
    additional_features: { type: Object, default: null },

    // ✅ array of extra image paths
    other_imgs: { type: [String], default: [] },
  },
  { timestamps: true, _id: false },
);

module.exports = mongoose.model("Product", ProductSchema, "products");
