const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const rideModel = require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
// 🧭 Helper from mapService
const { getAddressCoordinate, getCaptainsInTheRadius } = mapService;

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoords = await getAddressCoordinate(pickup);

    if (!pickupCoords || typeof pickupCoords.lat !== 'number' || typeof pickupCoords.lon !== 'number') {
      throw new Error('Invalid pickup coordinates received from ORS API');
    }

    const captainsInTheRadius = await getCaptainsInTheRadius(
      pickupCoords.lat, // ✅ Corrected
      pickupCoords.lon, // ✅ Corrected
      2
    );


    ride.otp = ''; // clear OTP before broadcasting

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    captainsInTheRadius.forEach((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: 'newRide',
        data: rideWithUser,
      });
    });

    return res.status(201).json(ride);
  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Failed to create ride',
    });
  }
};


module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});

  }
  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({rideId, captain: req.captain});
    console.log('Ride confirmed:',ride.user.socketId, ride)

    sendMessageToSocketId(ride.user.socketId, {
      event: 'rideConfirmed',
      data: ride
    })
    return res.status(200).json(ride);
    
  } catch (err) {
    return res.status(500).json({ message: err.message});
  }
}



module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } 
}
