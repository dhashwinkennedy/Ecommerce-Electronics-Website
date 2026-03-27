const HttpError = require("../models/http-error");
const WishlistModel = require("../models/wishlistModel.js");
const { loadProduct } = require("./loadModelProduct");

const getWishlistDB = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) return next(new HttpError("userId is required.", 400));

  let wishlist;
  try {
    wishlist = await WishlistModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!wishlist) return next(new HttpError("Wishlist not found.", 404));

  const resultantDB = [];
  for (const productId of wishlist.items) {
    let product;
    try {
      product = await loadProduct(productId);
    } catch (err) {
      continue;
    }
    resultantDB.push({
      ...product.toObject({ getters: true }),
      img_address: `/images/product_images/${product._id}/img.jpg`,
    });
  }

  res.status(200).json({ wishlist: resultantDB });
};

// --- ADD item to wishlist ---
const addToWishlist = async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return next(new HttpError("userId and productId are required.", 400));
  }

  let wishlist;
  try {
    wishlist = await WishlistModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!wishlist) {
    return next(new HttpError("Wishlist not found.", 404));
  }

  // ✅ check if already exists
  if (wishlist.items.includes(productId)) {
    return next(new HttpError("Item already exists in wishlist.", 400));
  }

  wishlist.items.push(productId);

  try {
    await wishlist.save();
  } catch (err) {
    return next(
      new HttpError("Adding to wishlist failed, please try again.", 500),
    );
  }

  res.status(200).json({ wishlist: wishlist.toObject({ getters: true }) });
};

// --- REMOVE item from wishlist ---
const removeFromWishlist = async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return next(new HttpError("userId and productId are required.", 400));
  }

  let wishlist;
  try {
    wishlist = await WishlistModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!wishlist) {
    return next(new HttpError("Wishlist not found.", 404));
  }

  // ✅ check if item exists before removing
  if (!wishlist.items.includes(productId)) {
    return next(new HttpError("Item not found in wishlist.", 404));
  }

  wishlist.items = wishlist.items.filter((id) => id !== productId);

  try {
    await wishlist.save();
  } catch (err) {
    return next(
      new HttpError("Removing from wishlist failed, please try again.", 500),
    );
  }

  res.status(200).json({ wishlist: wishlist.toObject({ getters: true }) });
};

exports.addToWishlist = addToWishlist;
exports.removeFromWishlist = removeFromWishlist;
exports.getWishlistDB = getWishlistDB;
