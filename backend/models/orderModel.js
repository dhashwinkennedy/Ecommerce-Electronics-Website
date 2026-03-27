const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  orderId: { type: String, required: true }, // not unique, multiple products can share one
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
  purchaseDate: { type: Date, required: true },
  deliveryDate: { type: Date, default: null },
  img_address: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "delivered", "canceled"],
    default: "pending",
  },
  paymentMode: {
    type: String,
    enum: [
      "cash_on_delivery",
      "upi",
      "credit_card",
      "debit_card",
      "net_banking",
    ],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
});

const orderSchema = new Schema(
  {
    _id: { type: String, required: true },
    orders: [orderItemSchema],
    orders_placed: { type: Number, default: 0 },
    orders_pending: { type: Number, default: 0 },
    orders_canceled: { type: Number, default: 0 },
  },
  { _id: false },
);

module.exports = mongoose.model("orderModel", orderSchema, "orders");
