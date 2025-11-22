const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
// 🧭 Helper from mapService
const { getAddressCoordinate, getCaptainsInTheRadius } = mapService;
const ApiError = require("../utils/ApiError");


module.exports.getFare = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { pickup, destination } = req.query;

    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json({
      success: true,
      fare,
    });
  } catch (error) {
    next(ApiError.internal(error.message || "Internal Server Error"));
  }
};


// module.exports.createRide = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return next(ApiError.badRequest("Validation failed", errors.array()));
//     }

//     const { pickup, destination, vehicleType } = req.body;

//     const ride = await rideService.createRide({
//       user: req.user._id,
//       pickup,
//       destination,
//       vehicleType,
//     });

//     const pickupCoords = await getAddressCoordinate(pickup);
//     if (!pickupCoords || typeof pickupCoords.lat !== "number" || typeof pickupCoords.lon !== "number") {
//       return next(ApiError.internal("Invalid pickup coordinates received from ORS API"));
//     }

//     const captainsInTheRadius = await getCaptainsInTheRadius(
//       pickupCoords.lat,
//       pickupCoords.lon,
//       2
//     );

//     ride.otp = ""; // clear OTP before broadcasting

//     const rideWithUser = await rideModel.findById(ride._id).populate("user");

//     captainsInTheRadius.forEach((captain) => {
//       sendMessageToSocketId(captain.socketId, {
//         event: "newRide",
//         data: rideWithUser,
//       });
//     });

//     return res.status(201).json({
//       success: true,
//       ride,
//     });
//   } catch (error) {
//     next(ApiError.internal(error.message || "Failed to create ride"));
//   }
// };


module.exports.createRide = async (req, res, next) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { pickup, destination, vehicleType } = req.body;

    // Create ride
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    // Convert pickup address to coordinates
    const pickupCoords = await getAddressCoordinate(pickup);
    if (
      !pickupCoords ||
      typeof pickupCoords.lat !== "number" ||
      typeof pickupCoords.lon !== "number"
    ) {
      return next(ApiError.internal("Invalid pickup coordinates received from ORS API"));
    }

    // Get captains nearby
    const captainsInTheRadius = await getCaptainsInTheRadius(
      pickupCoords.lat,
      pickupCoords.lon,
      2
    );

    // Remove OTP before sending broadcast
    ride.otp = "";

    // Populate user info
    const rideWithUser = await rideModel.findById(ride._id).populate("user");

    // Send ride request to each captain in radius
    for (const nearbyCaptain of captainsInTheRadius) {
      // Re-fetch full captain document with socketId
      const fullCaptain = await captainModel
        .findById(nearbyCaptain._id)
        .select("socketId");

      if (!fullCaptain || !fullCaptain.socketId) {
        console.log("❌ Captain has no active socket, skipping:", nearbyCaptain._id);
        continue;
      }

      console.log("📤 Sending newRide to captain socket:", fullCaptain.socketId);

      sendMessageToSocketId(fullCaptain.socketId, {
        event: "newRide",
        data: rideWithUser,
      });
    }

    // Send success response
    return res.status(201).json({
      success: true,
      ride,
    });

  } catch (error) {
    next(ApiError.internal(error.message || "Failed to create ride"));
  }
};



module.exports.confirmRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { rideId } = req.body;

    const ride = await rideService.confirmRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "rideConfirmed",
      data: ride,
    });

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(ApiError.internal(error.message || "Failed to confirm ride"));
  }
};


module.exports.startRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { rideId, otp } = req.query;

    const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(ApiError.internal(error.message || "Failed to start ride"));
  }
};


module.exports.endRide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { rideId } = req.body;

    const ride = await rideService.endRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    next(ApiError.internal(error.message || "Failed to end ride"));
  }
};
