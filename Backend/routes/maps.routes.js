const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator')

router.get('/get-coordinates',
  query('address').isString().isLength({ min:3}), authMiddleware.authUser, mapController.getCoordinates
 );

 router.get('/get-distance-time',
  query('origin').isString().isLength({ min:3 }).withMessage('Origin is required'),
  query('destination').isString().isLength({ min:3}).withMessage('Destination is required'),
  authMiddleware.authUser, mapController.getDistanceTime
 )


 router.get(
  '/get-autocomplete-suggestions',
  query('input').isString().isLength({ min: 2 }).withMessage('Input must be at least 2 characters'),
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions
);




// router.post("/route", async (req, res, next) => {
//   try {
//     const { start, end } = req.body;

//     const orsResponse = await axios.post(
//       "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
//       {
//         coordinates: [
//           [start[1], start[0]], // lng, lat
//           [end[1], end[0]]      // lng, lat
//         ]
//       },
//       {
//         headers: {
//           Authorization: process.env.ORS_API_KEY,
//           "Content-Type": "application/json",
//         }
//       }
//     );

//     res.status(200).json({
//       success: true,
//       data: orsResponse.data,
//     });
//   } catch (err) {
//     return next(ApiError.internal(err.response?.data || "ORS route failed"));
//   }
// });


 module.exports = router;