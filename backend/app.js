require("dotenv").config(); // ← must be at the very top of app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const HomePageController = require("./routes/page-routes");
const UserPageController = require("./routes/user-routes");
const CartPageController = require("./routes/cart-routes");
const WishlistPageController = require("./routes/wishlist-routes");
const OrderPageController = require("./routes/order-routes");
const ProductPageController = require("./routes/product-routes");
const HttpError = require("./models/http-error");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/", HomePageController); // => /api/places...
app.use("/api/product", HomePageController); // => /api/places...
app.use("/api/user", UserPageController); // => /api/places...
app.use("/api/cart", CartPageController);
app.use("/api/wishlist", WishlistPageController);
app.use("/api/order", OrderPageController);
app.use("/api/product", ProductPageController);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
HttpError;
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT);
    console.log(`MongoDB Connected:`);
  })
  .catch((err) => {
    console.log(err);
  });
