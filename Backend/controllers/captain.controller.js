// const captainModel = require("../models/captain.model");
// const captainService = require("../services/captain.service");
// const { validationResult } = require("express-validator");
// const blacklistTokenModel = require("../models/blacklistToken.model");

// module.exports.registerCaptain = async (req, res, next) => {
//   try {
//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password, vehicle } = req.body;

//     // Check if captain already exists
//     const isCaptainAlreadyExist = await captainModel.findOne({ email });
//     if (isCaptainAlreadyExist) {
//       return res.status(400).json({ message: "Captain already exists" });
//     }

//     // Hash the password before saving
//     const hashedPassword = await captainModel.hashPassword(password);

//     // Create and save the captain
//     const captain = await captainService.createCaptain({
//       firstname: fullname.firstname,
//       lastname: fullname.lastname,
//       email,
//       password: hashedPassword,
//       color: vehicle.color,
//       plate: vehicle.plate,
//       capacity: vehicle.capacity,
//       vehicleType: vehicle.vehicleType,
//       location: {
//         type: "Point",
//         coordinates: [0, 0], // default coordinates
//       },
//     });

//     // Generate authentication token
//     const token = await captain.generateAuthToken();

//     // Return the response with the token and captain information
//     res.status(201).json({ token, captain });
//   } catch (error) {
//     next(error); // Pass error to centralized error handler
//   }
// };

// module.exports.loginCaptain = async (req, res, next) => {
//   try {
//     // Validate input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     // Find the captain by email
//     const captain = await captainModel.findOne({ email }).select("+password");

//     // If captain does not exist, return an error
//     if (!captain) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Compare the password
//     const isMatch = await captain.comparePassword(password);

//     // If password does not match, return an error
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate authentication token
//     const token = await captain.generateAuthToken();

//     // Return the response with the token and captain information
//     res.cookie("token", token);

//     res.status(200).json({ token, captain });
//   } catch (error) {
//     next(error); // Pass error to centralized error handler
//   }
// };

// module.exports.getCaptainProfile = (req, res, next) => {
//   res.status(200).json(req.captain);
// };

// module.exports.logoutCaptain = async (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.split("")[1];

//   await blacklistTokenModel.create({ token });

//   res.clearCookie("token");
//   res.status(200).json({ message: "Captain logged out Successfully" });
// };



const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const { genTokenAndSetCookie } = require("../services/genTokenAndSetCookie");
const ApiError = require("../utils/ApiError");

// 🚀 Register Captain
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

// 🚀 Login Captain
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

// 🚀 Captain Profile
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

// 🚀 Logout Captain
// module.exports.logoutCaptain = async (req, res, next) => {
//   try {
//     res.clearCookie("token");

//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return next(ApiError.badRequest("No token provided for logout"));
//     }

//     await blacklistTokenModel.create({ token });

//     return res.status(200).json({
//       success: true,
//       message: "Captain logged out successfully",
//     });
//   } catch (error) {
//     next(ApiError.internal(error.message));
//   }
// };


module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies.captain_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(ApiError.badRequest("No captain token provided for logout"));
    }

    // Add token to blacklist
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
