const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");
const userController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 7 }),
  ],
  userController.signUp
);
router.post("/login", userController.login);

module.exports = router;
