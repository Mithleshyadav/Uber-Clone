import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const destination = [28.6448, 77.216721]; // [lat, lng]

  // Update map center on GPS change
  const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position);
      }
    }, [position]);
    return null;
  };

  // Get current location and track it
  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude]; // [lat, lng]
        setCurrentPosition(newPos);

        // Get route from ORS when user moves
        fetchRouteFromORS(newPos, destination);
      },
      (error) => {
        console.error('Error getting position:', error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch route from ORS
  const fetchRouteFromORS = async (start, end) => {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          coordinates: [
            [start[1], start[0]], // [lng, lat]
            [end[1], end[0]],     // [lng, lat]
          ],
        },
        {
          headers: {
            Authorization: import.meta.env.VITE_ORS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      // ORS returns [lng, lat], convert back to [lat, lng] for Leaflet
      const coords = response.data.features[0].geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      );
      setRouteCoords(coords);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  };

  return (
    <div className="w-full h-screen">
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition} />
          <Marker position={destination} />
          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
          <MapUpdater position={currentPosition} />
        </MapContainer>
      )}
    </div>
  );
};

export default LiveTracking;
