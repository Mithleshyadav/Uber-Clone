const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        // Check if captain already exists
        const isCaptainAlreadyExist = await captainModel.findOne({ email });
        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await captainModel.hashPassword(password);

        // Create and save the captain
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
        });

        // Log the captain object to inspect what is being returned
        // console.log("Captain object:", captain);
        // console.log("Is captain a Mongoose instance?", captain instanceof captainModel);

        // Ensure captain is a valid Mongoose instance
        if (!captain || !(captain instanceof captainModel)) {
            throw new Error('Captain creation failed or invalid captain instance');
        }

        // Generate authentication token
        const token = await captain.generateAuthToken();

        // Return the response with the token and captain information
        res.status(201).json({ token, captain });
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
};
