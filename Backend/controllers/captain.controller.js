const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

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


        // Generate authentication token
        const token = await captain.generateAuthToken();

        // Return the response with the token and captain information
        res.status(201).json({ token, captain });
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }
}


module.exports.loginCaptain = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find the captain by email
        const captain = await captainModel.findOne({ email }).select('+password');

        // If captain does not exist, return an error
        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await captain.comparePassword(password);

        // If password does not match, return an error
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate authentication token
        const token = await captain.generateAuthToken();

        // Return the response with the token and captain information
        res.cookie('token', token);
        
        res.status(200).json({ token, captain });
    } catch (error) {
        next(error); // Pass error to centralized error handler
    }

}

module.exports.getCaptainProfile = (req, res, next) => {
   
    res.status(200).json(req.captain);
};

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split('')[1];

    await blacklistTokenModel.create({token});

    res.clearCookie('token');
    res.status(200).json({ message: 'Captain logged out Successfully' });
}







