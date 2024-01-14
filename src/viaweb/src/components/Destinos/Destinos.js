// components/Destinations.js
import React from 'react';
import TripList from './TripList';
import '../../styles/Destinos.css';

const Destinations = () => (
  <div className="destinations-container">
    <h2 className="destinations-title">DESTINOS</h2>
    
    <TripList />
  </div>
);

export default Destinations;
