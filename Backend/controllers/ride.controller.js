const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');

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

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({user:req.user._id, pickup, destination, vehicleType});
    console.log(ride);
    res.status(201).json(ride);

    const pickupCoords = await mapService.getAddressCoordinate(pickup);

    const captainsInTheRadius = await rideService.getCaptainsInTheRadius(pickupCoords.ltd, pickupCoords.lng, 2);

    
    console.log('Captains in the radius:', captainsInTheRadius)
    ride.otp = "";

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    captainsInTheRadius.map(captain => {
      sendMessageToSocketId(captain.socketId, {
        event: 'newRide',
        data: rideWithUser
      })
    })

  }
  catch (err) {
    return res.status(500).json({ message: err.message
 
    })
  }
}

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});

  }
  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({rideId, captain: req.captain});

    sendMessageToSocketId(ride.user.socketId, {
      event: 'rideConfirmed',
      data: ride
    })
    return res.status(200).json(ride);
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message});
  }
}