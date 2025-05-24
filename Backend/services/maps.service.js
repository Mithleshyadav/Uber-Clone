const axios = require('axios');

const ORS_API_KEY = process.env.ORS_API_KEY;
const GEOCODE_URL = 'https://api.openrouteservice.org/geocode/search';
const ROUTING_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

// 🔍 Get coordinates for an address
module.exports.getAddressCoordinate = async (address) => {
  if (!address) throw new Error('Address is required');

  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        api_key: ORS_API_KEY,
        text: address,
        size: 1,
        boundary_country: 'NP'
      }
    });

    const feature = response.data.features[0];
    if (!feature) throw new Error('No coordinates found for this address');

    const [lon, lat] = feature.geometry.coordinates;

    return { lat, lon };
  } catch (error) {
    console.error('Geocoding failed:', error.message);
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
      [lon2, lat2]
    ]
  };

  try {
    const response = await axios.post(ROUTING_URL, body, {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const route = response.data.routes?.[0];
    if (!route) throw new Error('No route found');
   console.log(route.summary.distance)
    return {
      distanceInKm: (route.summary.distance / 1000).toFixed(2),
      durationInMin: (route.summary.duration / 60).toFixed(2)
    };
  } catch (error) {
    console.error('Routing failed:', error.message);
    throw new Error('Unable to fetch distance and time');
  }
};



module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error('Input is required for suggestions');

  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        api_key: ORS_API_KEY,
        text: input,
        size: 5, // return top 5 matches
        boundary_country: 'NP' // limit to Nepal
      }
    });

    const suggestions = response.data.features.map(feature => ({
      label: feature.properties.label,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0]
    }));

    return suggestions;
  } catch (error) {
    console.error('Autocomplete failed:', error.message);
    throw new Error('Unable to fetch autocomplete suggestions');
  }
};
