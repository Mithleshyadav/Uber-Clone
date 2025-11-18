const userModel = require("../models/user.model");
const { createUser } = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const { genTokenAndSetCookie } = require("../services/genTokenAndSetCookie");
const ApiError = require("../utils/ApiError");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }
    const { fullname, email, password } = req.body;
    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return next(ApiError.badRequest("User already exists"));
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return next(ApiError.internal("Failed to create user"));
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully, Please Login to continue",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    

    if (!user) {
      return next(ApiError.badRequest("Invalid email or password"));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.badRequest("Invalid email or password"));
    }

    const token = await genTokenAndSetCookie(user._id, res, "user_token");

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.user_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(ApiError.badRequest("No user token provided for logout"));
    }

    // Add token to blacklist
    await blacklistTokenModel.create({ token });

    // Clear user cookie
    res.clearCookie("user_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

module.exports.checkAuth = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(ApiError.notFound("User validation failed"));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};
