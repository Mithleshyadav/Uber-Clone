const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt  = require('bcryptjs');
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


function getOtp(num) {
  const min = Math.pow(10, num - 1); // e.g., 100000 for 6-digit
  const max = Math.pow(10, num);     // e.g., 1000000
  const otp = crypto.randomInt(min, max).toString();
  return otp;

}


module.exports.createRide = async ({
  user, pickup, destination, vehicleType
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }
  const fare = await getFare( pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    otp: getOtp(6),
    fare: fare[vehicleType]
  })
  
  return ride;
}

module.exports.confirmRide = async ({rideId, captain}) => {
 if(!rideId) {
  throw new Error('Ride ID is required');
 }
 await rideModel.findOneAndUpdate({
  _id: rideId
 }, {
    status: 'accepted',
    captain: captain._id
 })
 
 const ride = await rideModel.findOne({
  _id: rideId
 }).populate('user').populate('captain').select('+otp');

 if (!ride) {
  throw new Error('Ride not found');
 }
  return ride;
}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');
    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}