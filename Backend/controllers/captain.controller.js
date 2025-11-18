const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const { genTokenAndSetCookie } = require("../services/genTokenAndSetCookie");
const ApiError = require("../utils/ApiError");


module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
      return next(ApiError.badRequest("Captain already exists"));
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    });

    if (!captain) {
      return next(ApiError.internal("Failed to create captain"));
    }

    return res.status(201).json({
      success: true,
      message: "Captain registered successfully, Please Login to continue",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};


module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return next(ApiError.badRequest("Invalid email or password"));
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return next(ApiError.badRequest("Invalid email or password"));
    }

    // ✅ Generate JWT and set in cookie (like user controller)
    const token = await genTokenAndSetCookie(captain._id, res, "captain_token");

    console.log(token, "Captain successfully logged in");

    return res.status(200).json({
      success: true,
      message: "Captain logged in successfully",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};


module.exports.getCaptainProfile = (req, res, next) => {
  try {
    if (!req.captain) {
      return next(ApiError.notFound("Captain not found"));
    }
   console.log(req.captain, "Captain profile accessed");
    return res.status(200).json({
      success: true,
      captain: req.captain,
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies.captain_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(ApiError.badRequest("No captain token provided for logout"));
    }

   
    await blacklistTokenModel.create({ token });

    // Clear captain cookie
    res.clearCookie("captain_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Captain logged out successfully",
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};
