const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const CartModel = require("../models/cartModel");
const WishlistModel = require("../models/wishlistModel");
const OrderModel = require("../models/orderModel");

const generateUserId = async () => {
  let isUnique = false;
  let userId;
  while (!isUnique) {
    const digits = Math.floor(Math.random() * (99999999 - 100000 + 1)) + 100000;
    userId = `EEUID${digits}`;
    const existing = await UserModel.findOne({ _id: userId });
    if (!existing) isUnique = true;
  }
  return userId;
};

// --- GET USER ---
const getUser = async (req, res, next) => {
  const { uid } = req.params;

  let user;
  try {
    user = await UserModel.findById(uid).select("-password");
  } catch (err) {
    return next(new HttpError("Something went wrong.", 500));
  }

  if (!user) return next(new HttpError("User not found.", 404));

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

// --- LOGIN ---
const login = async (req, res, next) => {
  const { email_phone, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({
      $or: [{ email: email_phone }, { phone: email_phone }],
    });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500),
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401),
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500),
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401),
    );
  }

  const token = jwt.sign(
    { userId: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    userId: existingUser._id,
    token,
    user: {
      firstName: existingUser.firstName,
      surname: existingUser.surname,
      email: existingUser.email,
      phone: existingUser.phone,
      profilePic: existingUser.profilePic || null,
    },
  });
};

// --- SIGNUP ---
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { firstName, surname, email, phone, password, dob, profilePic } =
    req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500),
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422),
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  let userId;
  try {
    userId = await generateUserId();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  const createdUser = new UserModel({
    _id: userId,
    firstName,
    surname,
    dob,
    email,
    phone,
    profilePic: profilePic || "/profile/profile-logo.png",
    password: hashedPassword,
    total_orders: 0,
    completed_orders: 0,
    pending_orders: 0,
    cancelled_orders: 0,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  try {
    await CartModel.create({ _id: userId, items: [] });
    await WishlistModel.create({ _id: userId, items: [] });
    await OrderModel.create({ _id: userId, orders: [] });
  } catch (err) {
    await UserModel.findByIdAndDelete(userId);
    return next(new HttpError("Signing up failed, please try again.", 500));
  }

  res
    .status(201)
    .json({ message: "Account created successfully. Please log in." });
};

// --- UPDATE ACCOUNT ---
// ✅ no password required — just update fields directly
const updateAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your input.", 422),
    );
  }

  const { UID, firstName, surname, email, phone, dob, profilePic } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findById(UID);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500),
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("User does not exist, could not update the account.", 404),
    );
  }

  let updatedUser;
  try {
    updatedUser = await UserModel.findByIdAndUpdate(
      UID,
      { $set: { firstName, surname, email, phone, dob, profilePic } },
      { new: true },
    ).select("-password");
  } catch (err) {
    return next(
      new HttpError("Updating account failed, please try again later.", 500),
    );
  }

  res.status(200).json({ user: updatedUser.toObject({ getters: true }) });
};

// --- DELETE ACCOUNT ---
const deleteAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your input.", 422),
    );
  }

  const { UID, password } = req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findById(UID);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500),
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("User does not exist, could not delete the account.", 404),
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500),
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not delete the account.", 401),
    );
  }

  try {
    await UserModel.deleteOne({ _id: UID });
    await CartModel.deleteOne({ _id: UID });
    await WishlistModel.deleteOne({ _id: UID });
    await OrderModel.deleteOne({ _id: UID });
  } catch (err) {
    return next(
      new HttpError("Deleting account failed, please try again later.", 500),
    );
  }

  res.status(200).json({ message: "Account deleted successfully" });
};

exports.getUser = getUser;
exports.login = login;
exports.signup = signup;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
