const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const env = require("dotenv").config;

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authorization Failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(process.env.JWT_SECRET);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    const error = new HttpError("Authorization Failed", 401);
    return next(error);
  }
};
