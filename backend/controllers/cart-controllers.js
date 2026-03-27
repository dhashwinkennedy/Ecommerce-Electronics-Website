const HttpError = require("../models/http-error");
const CartModel = require("../models/cartModel");
const { loadProduct } = require("./loadModelProduct");

// helper to return full product details
const getFullCartItems = async (cartItems) => {
  const resultantDB = [];
  for (const item of cartItems) {
    let product;
    try {
      product = await loadProduct(item.productId);
    } catch (err) {
      continue;
    }
    const productObj = product.toObject({ getters: true });
    resultantDB.push({
      ...productObj,
      qty: item.qty,
      img_address: `/images/product_images/${productObj._id}/img.jpg`, // ✅ add this
    });
  }
  return resultantDB;
};
const getCartDB = async (req, res, next) => {
  const { userId } = req.body;

  let cart;
  try {
    cart = await CartModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong.", 500));
  }

  if (!cart) return next(new HttpError("Cart not found.", 404));

  const resultantDB = await getFullCartItems(cart.items);
  res.status(200).json({ cart: resultantDB });
};

const addToCart = async (req, res, next) => {
  const { userId, productId, qty } = req.body;

  if (!userId || !productId) {
    return next(new HttpError("userId and productId are required.", 400));
  }

  let cart;
  try {
    cart = await CartModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!cart) return next(new HttpError("Cart not found.", 404));

  const existingItem = cart.items.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.qty += qty || 1;
  } else {
    cart.items.push({ productId, qty: qty || 1 });
  }

  try {
    await cart.save();
  } catch (err) {
    return next(new HttpError("Adding to cart failed, please try again.", 500));
  }

  const resultantDB = await getFullCartItems(cart.items);
  res.status(200).json({ cart: resultantDB });
};

const updateCartItem = async (req, res, next) => {
  const { userId, productId, qty } = req.body;

  if (!userId || !productId || !qty) {
    return next(new HttpError("userId, productId and qty are required.", 400));
  }
  if (qty < 1) {
    return next(new HttpError("Quantity must be at least 1.", 400));
  }

  let cart;
  try {
    cart = await CartModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!cart) return next(new HttpError("Cart not found.", 404));

  const item = cart.items.find((item) => item.productId === productId);
  if (!item) return next(new HttpError("Item not found in cart.", 404));

  item.qty = qty;

  try {
    await cart.save();
  } catch (err) {
    return next(new HttpError("Updating cart failed, please try again.", 500));
  }

  const resultantDB = await getFullCartItems(cart.items);
  res.status(200).json({ cart: resultantDB });
};

const removeFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return next(new HttpError("userId and productId are required.", 400));
  }

  let cart;
  try {
    cart = await CartModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!cart) return next(new HttpError("Cart not found.", 404));

  const itemExists = cart.items.find((item) => item.productId === productId);
  if (!itemExists) return next(new HttpError("Item not found in cart.", 404));

  cart.items = cart.items.filter((item) => item.productId !== productId);

  try {
    await cart.save();
  } catch (err) {
    return next(
      new HttpError("Removing from cart failed, please try again.", 500),
    );
  }

  const resultantDB = await getFullCartItems(cart.items);
  res.status(200).json({ cart: resultantDB });
};

exports.getCartDB = getCartDB;
exports.addToCart = addToCart;
exports.updateCartItem = updateCartItem;
exports.removeFromCart = removeFromCart;
