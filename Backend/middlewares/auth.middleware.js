// const userModel = require('../models/user.model.js');
// const captainModel = require('../models/captain.model.js');
// const blacklistTokenModel = require('../models/blacklistToken.model.js');
// const jwt = require('jsonwebtoken');
// const ApiError = require('../utils/ApiError.js');

// // Middleware to authenticate a captain
// module.exports.authCaptain = async (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//   if (!token) {
//    return next(ApiError.unauthorized("Authentication token not found"));
//   }

//   try {
//     // Check if the token is blacklisted
//     const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
//     if (isBlacklisted) {
//       return next(ApiError.unauthorized("Token has been blacklisted. Please login again."));
//     }

//     // Verify the token and attach the captain to the request
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const captain = await captainModel.findById(decoded._id);

//     if (!captain) {
//       return next(ApiError.unauthorized("Captain not found. Invalid token."));
//     }

//     req.captain = captain;
//     return next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized', error: err.message });
//   }
// };

// module.exports.authUser = async (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return next(ApiError.unauthorized("Authentication token not found"));
//     }

//     // Check if token is blacklisted (user logged out previously)
//     const isBlacklisted = await blacklistTokenModel.findOne({ token });
//     if (isBlacklisted) {
//       return next(ApiError.unauthorized("Token has been blacklisted. Please login again."));
//     }

//     // Verify token and attach user to req
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     console.log("decoded:", decoded);
//     const user = await userModel.findById(decoded._id);
//     if (!user) {
//       return next(ApiError.unauthorized("User not found. Invalid token."));
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     // Token invalid, expired, or malformed
//     return next(ApiError.unauthorized("Invalid or expired token", [error.message]));
//   }
// };

const userModel = require("../models/user.model.js");
const captainModel = require("../models/captain.model.js");
const blacklistTokenModel = require("../models/blacklistToken.model.js");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");

// Middleware to authenticate a captain
module.exports.authCaptain = async (req, res, next) => {
  const token =
    req.cookies.captain_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Captain authentication token not found"));
  }

  try {
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return next(
        new ApiError(401, "Token is blacklisted. Please login again.")
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return next(new ApiError(401, "Captain not found. Invalid token."));
    }

    req.captain = captain;
    next();
  } catch (err) {
    return next(
      new ApiError(401, "Invalid or expired captain token", [err.message])
    );
  }
};

// Middleware to authenticate a user
module.exports.authUser = async (req, res, next) => {
  const token =
    req.cookies.user_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "User authentication token not found"));
  }

  try {
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return next(
        new ApiError(401, "Token is blacklisted. Please login again.")
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return next(new ApiError(401, "User not found. Invalid token."));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ApiError(401, "Invalid or expired user token", [error.message])
    );
  }
};
