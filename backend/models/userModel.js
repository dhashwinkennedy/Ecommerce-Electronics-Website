const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    profilePic: { type: String, default: "/profile/profile-logo.png" },
    total_orders: { type: Number, default: 0 },
    completed_orders: { type: Number, default: 0 },
    cancelled_orders: { type: Number, default: 0 },
    pending_orders: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserModel", userSchema, "users");
