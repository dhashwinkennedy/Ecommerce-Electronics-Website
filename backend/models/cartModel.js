const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: { type: String, required: true },
  qty: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = new Schema(
  {
    _id: { type: String, required: true },
    items: [cartItemSchema],
  },
  { _id: false },
);

module.exports = mongoose.model("cartModel", cartSchema, "cart");
