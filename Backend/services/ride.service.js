const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt  = require('bcrypt');
const crypto = require('crypto');



const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  // Step 1: Convert address to coordinates
  const pickupCoords = await mapService.getAddressCoordinate(pickup);
  const destinationCoords = await mapService.getAddressCoordinate(destination);

  // Step 2: Get distance and time
  const distanceTime = await mapService.getDistanceTime(pickupCoords, destinationCoords);
  console.log('DistanceTime:', distanceTime);

  const distanceInKm = parseFloat(distanceTime.distanceInKm);
  const durationInMin = parseFloat(distanceTime.durationInMin);

  const baseFare = {
    car: 100,
    auto: 50,
    moto: 30
  };

  const perKmRate = {
    car: 25,
    auto: 15,
    moto: 10
  };

  const perMinuteRate = {
    car: 8,
    auto: 4,
    moto: 2
  };

  const fare = {
    car: Math.round(baseFare.car + (distanceInKm * perKmRate.car) + (durationInMin * perMinuteRate.car)),
    auto: Math.round(baseFare.auto + (distanceInKm * perKmRate.auto) + (durationInMin * perMinuteRate.auto)),
    moto: Math.round(baseFare.moto + (distanceInKm * perKmRate.moto) + (durationInMin * perMinuteRate.moto))
  };

  return fare;
};



module.exports.getFare = getFare;