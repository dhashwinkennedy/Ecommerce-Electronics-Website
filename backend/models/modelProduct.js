const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ModelProductSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    org_price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    total_rating: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "ModelProduct",
  ModelProductSchema,
  "modelProducts",
);
