const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator')


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    // Convert origin/destination to coordinates
    const originCoords = await mapService.getAddressCoordinate(origin);
    const destinationCoords = await mapService.getAddressCoordinate(destination);

    const distanceTime = await mapService.getDistanceTime(originCoords, destinationCoords);

    res.status(200).json(distanceTime);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
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
