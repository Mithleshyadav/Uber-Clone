const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
  location, // 👈 include this
}) => {

  if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
    throw new Error('All fields are required');
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
    location: location || {
      type: "Point",
      coordinates: [0, 0], //  fallback default
    },
  });

  return captain;
};
