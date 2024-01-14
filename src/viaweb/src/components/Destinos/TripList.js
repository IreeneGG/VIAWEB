import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TripCard from './TripCard';

const TripList = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get('/api/travel/trips/destinations')
      .then(response => {
        const tripsData = response.data.map((destination) => ({
          tripID: destination.tripID, 
          destination: destination.destination, 
        }));
        setTrips(tripsData);
      })
      .catch(error => {
        console.error('Error al obtener los viajes:', error);
      });
  }, []);

  return (
    <div>
      {trips.map((trip) => (
        <TripCard key={trip.tripID} destination={trip.destination} id={trip.tripID}  />
      ))}
    </div>
  );
};

export default TripList;
