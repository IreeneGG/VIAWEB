import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TripCard.css';

const TripCard = ({ destination ,id}) => (
  <Link to={`/destinations/${id}`}>
    <div className="trip-card">
      <h3>{destination}</h3>
    </div>
  </Link>
);

export default TripCard;
