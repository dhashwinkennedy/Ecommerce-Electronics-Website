const HttpError = require("../models/http-error");
const Product = require("../models/product");
const CartModel = require("../models/cartModel");
const WishlistModel = require("../models/wishlistModel");

const getProductPage = async (req, res, next) => {
  const productId = req.params.pid;
  const { userId } = req.query; // optional — pass userId if logged in

  // --- fetch product ---
  let productData;
  try {
    productData = await Product.findById(productId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find product.", 500),
    );
  }

  if (!productData) {
    return next(new HttpError("Product not found.", 404));
  }

  const product = productData.toObject({ getters: true });

  // ✅ generate img_address from _id
  product.img_address = `/images/product_images/${product._id}/img.jpg`;

  // ✅ generate other_imgs if empty
  if (!product.other_imgs || product.other_imgs.length === 0) {
    product.other_imgs = [`/images/product_images/${product._id}/img.jpg`];
  }

  let isWishlisted = false;
  let isInCart = false;

  // ✅ check wishlist and cart only if user is logged in
  if (userId) {
    try {
      const wishlist = await WishlistModel.findById(userId);
      if (wishlist) {
        isWishlisted = wishlist.items.includes(productId);
      }
    } catch (err) {
      // non-critical — don't fail the whole request
      console.error("Wishlist check failed:", err);
    }

    try {
      const cart = await CartModel.findById(userId);
      if (cart) {
        isInCart = cart.items.some((item) => item.productId === productId);
      }
    } catch (err) {
      console.error("Cart check failed:", err);
    }
  }

  res.json({ product, isWishlisted, isInCart });
};

exports.getProductPage = getProductPage;
