const HttpError = require("../models/http-error");
const OrderModel = require("../models/orderModel");

const generateOrderId = () => {
  const digits =
    Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000;
  return `EEOID${digits}`;
};

const getOrderDB = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new HttpError("userId is required.", 400));
  }

  let orderDB;
  try {
    orderDB = await OrderModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!orderDB) {
    return next(new HttpError("Orders collection not found.", 404));
  }

  // ✅ missing response added
  res.status(200).json({ orders: orderDB.toObject({ getters: true }) });
};

// --- NEW ORDER ---
const newOrder = async (req, res, next) => {
  const { userId, products, paymentMode } = req.body;
  // products = [
  //   { productId: "PROD001", productName: "ASUS Laptop", price: 48000, qty: 2 },
  //   { productId: "PROD002", productName: "iPhone 15", price: 80000, qty: 1 },
  // ]

  if (!userId || !products || !products.length || !paymentMode) {
    return next(
      new HttpError("userId, products and paymentMode are required.", 400),
    );
  }

  let orderCollection;
  try {
    orderCollection = await OrderModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!orderCollection) {
    return next(new HttpError("Orders collection not found.", 404));
  }

  const paymentStatus = paymentMode === "cash_on_delivery" ? "pending" : "paid";
  const orderId = generateOrderId(); // ✅ same orderId for all products
  const purchaseDate = new Date();
  const newOrderItems = [];
  for (const product of products) {
    const { productId, productName, price, qty, img_address } = product; // ← add img_address

    if (!productId || !productName || !price) {
      return next(
        new HttpError(
          "Each product must have productId, productName and price.",
          400,
        ),
      );
    }

    newOrderItems.push({
      orderId,
      productId,
      productName,
      price,
      qty: qty || 1,
      purchaseDate,
      deliveryDate: null,
      status: "pending",
      paymentMode,
      paymentStatus,
      img_address: `/images/product_images/${productId}/img.jpg`,
    });
  }

  orderCollection.orders.push(...newOrderItems);
  orderCollection.orders_placed += products.length;
  orderCollection.orders_pending += products.length;

  try {
    await orderCollection.save();
  } catch (err) {
    return next(new HttpError("Placing order failed, please try again.", 500));
  }

  res.status(201).json({ orderId, orders: newOrderItems });
};

// --- UPDATE PAYMENT ---
const updatePayment = async (req, res, next) => {
  const { userId, orderId, productId, paymentMode } = req.body;

  if (!userId || !orderId || !productId || !paymentMode) {
    return next(
      new HttpError(
        "userId, orderId, productId and paymentMode are required.",
        400,
      ),
    );
  }

  if (paymentMode === "cash_on_delivery") {
    return next(
      new HttpError(
        "Cannot switch to cash on delivery once order is placed.",
        400,
      ),
    );
  }

  let orderCollection;
  try {
    orderCollection = await OrderModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!orderCollection) {
    return next(new HttpError("Orders collection not found.", 404));
  }

  const order = orderCollection.orders.find(
    (o) => o.orderId === orderId && o.productId === productId,
  );

  if (!order) {
    return next(new HttpError("Order item not found.", 404));
  }

  if (order.paymentMode !== "cash_on_delivery") {
    return next(
      new HttpError(
        "Payment method can only be changed from cash on delivery.",
        400,
      ),
    );
  }

  order.paymentMode = paymentMode;
  order.paymentStatus = "paid";

  try {
    await orderCollection.save();
  } catch (err) {
    return next(
      new HttpError("Updating payment failed, please try again.", 500),
    );
  }

  res.status(200).json({ order });
};

// --- CANCEL ORDER ---
const cancelOrder = async (req, res, next) => {
  const { userId, orderId, productId } = req.body;

  if (!userId || !orderId || !productId) {
    return next(
      new HttpError("userId, orderId and productId are required.", 400),
    );
  }

  let orderCollection;
  try {
    orderCollection = await OrderModel.findById(userId);
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again.", 500));
  }

  if (!orderCollection) {
    return next(new HttpError("Orders collection not found.", 404));
  }

  const order = orderCollection.orders.find(
    (o) => o.orderId === orderId && o.productId === productId,
  );

  if (!order) {
    return next(new HttpError("Order item not found.", 404));
  }

  if (order.status !== "pending") {
    return next(new HttpError("Only pending orders can be cancelled.", 400));
  }

  order.status = "canceled";

  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  } else if (order.paymentStatus === "pending") {
    order.paymentStatus = "failed";
  }

  orderCollection.orders_canceled += 1;
  orderCollection.orders_pending -= 1;

  try {
    await orderCollection.save();
  } catch (err) {
    return next(
      new HttpError("Cancelling order failed, please try again.", 500),
    );
  }

  res.status(200).json({ order });
};

exports.newOrder = newOrder;
exports.updatePayment = updatePayment;
exports.cancelOrder = cancelOrder;
exports.getOrderDB = getOrderDB;
