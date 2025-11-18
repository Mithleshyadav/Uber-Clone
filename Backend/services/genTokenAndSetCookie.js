const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");

module.exports.genTokenAndSetCookie = (userId, res, cookieName) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT secret is not configured");
    }

    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
      algorithm: "HS256",
      issuer: "your-app-name",
    });

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return token;
  } catch (error) {
    throw new ApiError(500, "Token generation failed: " + error.message);
  }
};
