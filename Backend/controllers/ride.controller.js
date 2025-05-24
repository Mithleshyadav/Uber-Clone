const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
//const mapService = require('../services/maps.service');
//const rideModel = require('../models/ride.model');

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    console.log(fare);
    return res.status(200).json(fare);

  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Internal Server Error'
    });
  }
}