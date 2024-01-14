import React, { useEffect, useState } from 'react';
import profileImage from './logo1.png';
import '../../styles/Profile.css';
import axios from 'axios';
import { useToken } from '../Login/TokenContext';

const Profile= () => {
  const [favoriteTrips, setFavoriteTrips] = useState([]);
  const { token } = useToken(); // Obtiene el token del contexto

 
  useEffect(() => {
    console.log("Solicitud GET a /api/auth/favorite-destinations/all:", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    // Realizar una solicitud para obtener la lista de viajes favoritos del usuario actual
    axios.get('/api/auth/favorite-destinations/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Utiliza el token del contexto
      },
      
    })
      .then(response => {
        
        setFavoriteTrips(response.data); // Actualizar el estado con los viajes favoritos
        console.log('Datos de destinos favoritos:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener los viajes favoritos:', error);
      });
  }, [token]); 

  return (
    <div className="profile-section">
      <h3 className="profile-name">PERFIL</h3>
      <img src={profileImage} alt="Profile" className="profile-image" />
      <div className="divider"></div>
      <h4 className="profile-subtitle">Viajes favoritos:{favoriteTrips.length}</h4>
      <ul className="profile-list">
     
        {favoriteTrips.map((trip, index) => (
          <li key={index}>{trip}</li>
        ))}
      </ul>
      
    </div>
    
  );
};

export default Profile;
