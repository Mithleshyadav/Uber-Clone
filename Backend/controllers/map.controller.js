const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");


module.exports.getCoordinates = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { address } = req.query;

    const coordinates = await mapService.getAddressCoordinate(address);
    if (!coordinates) {
      return next(ApiError.notFound("Coordinates not found"));
    }

    return res.status(200).json({
      success: true,
      coordinates,
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};


module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest("Validation failed", errors.array()));
    }

    const { origin, destination } = req.query;

    const originCoords = await mapService.getAddressCoordinate(origin);
    const destinationCoords = await mapService.getAddressCoordinate(destination);

    if (!originCoords || !destinationCoords) {
      return next(ApiError.badRequest("Invalid origin or destination address"));
    }

    const distanceTime = await mapService.getDistanceTime(
      originCoords,
      destinationCoords
    );

    return res.status(200).json({
      success: true,
      distanceTime,
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

