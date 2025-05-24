const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/get-fare',
  authMiddleware.authUser,
  query('pickup').isString().isLength({ min:3 }).withMessage('Invalid pickup address'),
  query('destination').isString().isLength({ min:3 }).withMessage('Invalid destination address'),
  rideController.getFare 
)

module.exports = router;