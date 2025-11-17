const axios = require('axios');
const captainModel = require('../models/captain.model');

const ORS_API_KEY = process.env.ORS_API_KEY;
const GEOCODE_URL = 'https://api.openrouteservice.org/geocode/search';
const ROUTING_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

// ✅ Coordinate validation function
function isValidCoordinate(lat, lon) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

// 🔍 Get coordinates for an address
module.exports.getAddressCoordinate = async (address) => {
  if (!address) throw new Error('Address is required');

  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        api_key: ORS_API_KEY,
        text: address,
        size: 1,
        boundary_country: 'NP',
      },
    });

    const feature = response.data.features[0];
    if (!feature) throw new Error('No coordinates found for this address');

    const [lon, lat] = feature.geometry.coordinates;

    if (!isValidCoordinate(lat, lon)) {
      throw new Error('Invalid coordinates received from ORS');
    }

    return { lat, lon };
  } catch (error) {
    throw new Error('Unable to fetch coordinates');
  }
};

// 🛣️ Get distance and time between two coordinates
module.exports.getDistanceTime = async (originCoords, destinationCoords) => {
  if (!originCoords || !destinationCoords) {
    throw new Error('Origin and destination coordinates are required');
  }

  const { lat: lat1, lon: lon1 } = originCoords;
  const { lat: lat2, lon: lon2 } = destinationCoords;

  const body = {
    coordinates: [
      [lon1, lat1],
      [lon2, lat2],
    ],
  };

  try {
    const response = await axios.post(ROUTING_URL, body, {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const route = response.data.routes?.[0];
    if (!route) throw new Error('No route found');

    return {
      distanceInKm: (route.summary.distance / 1000).toFixed(2),
      durationInMin: (route.summary.duration / 60).toFixed(2),
    };
  } catch (error) {
    throw new Error('Unable to fetch distance and time');
  }
};

// 🔍 Get autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error('Input is required for suggestions');

  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        api_key: ORS_API_KEY,
        text: input,
        size: 5,
        boundary_country: 'NP',
      },
    });

    const suggestions = response.data.features.map((feature) => ({
      label: feature.properties.label,
    }));

    return suggestions;
  } catch (error) {
    throw new Error('Unable to fetch autocomplete suggestions');
  }
};

// 📍 Get nearby captains within radius
module.exports.getCaptainsInTheRadius = async (lat, lon, radiusInKm) => {
  if (!isValidCoordinate(lat, lon)) {
    throw new Error('Invalid coordinates passed to ORS API');
  }

  const radiusInMeters = radiusInKm * 1000;

  const polygon = await getIsochronePolygon(lat, lon, radiusInMeters);

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $geometry: polygon,
      },
    },
  });

  return captains;
};

// 🧭 Get isochrone polygon from ORS
async function getIsochronePolygon(lat, lon, radiusInMeters) {
  if (!isValidCoordinate(lat, lon)) {
    throw new Error('Invalid coordinates passed to ORS API');
  }

  const response = await axios.post(
    'https://api.openrouteservice.org/v2/isochrones/driving-car',
    {
      locations: [[lon, lat]],
      range: [radiusInMeters],
    },
    {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const feature = response.data.features?.[0];
  if (!feature) {
    throw new Error('No isochrone polygon returned from ORS');
  }

  return feature.geometry;
}
