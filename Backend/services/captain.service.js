const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
    // Validate required fields
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    // Create a new captain instance
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    return captain;
};
