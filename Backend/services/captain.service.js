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
  // Validate required fields
  if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
    throw new Error('All fields are required');
  }

  // Create a new captain instance
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
