const uuid = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const HttpError = require("../models/http-error");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find().select("-password");
  } catch (err) {
    const error = new HttpError("Fetching all users failed, try again", 500);
    return next(error);
  }
  res.status(200).json({
    users: users.map((u) => u.toObject({ getters: true })),
  });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid Inputs, Please Check Data", 422));
  }

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    return next(new HttpError("User With That email already exist !", 422));
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create User, Please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: req.file.path,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signup failed, Please Try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError("Signup failed, Please Try again", 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging up failed, please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid Credentials, please try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check credentials",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid Credentials, please try again", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check credentials",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Login Successfull",
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
