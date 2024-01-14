import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/DestinationDetail.css';
import { useToken } from '../Login/TokenContext'; // Importa useToken

const DestinationDetail = () => {
  const { TripID } = useParams();
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [transportationTypes, setTransportationTypes] = useState([]);
  const [accommodationTypes, setAccommodationTypes] = useState([]);
  const [transportationPercentageData, setTransportationPercentageData] = useState([]);
  const [accommodationPercentageData, setAccommodationPercentageData] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { token } = useToken(); // Obtiene el token del contexto

  useEffect(() => {
    axios.get(`/api/travel/trips/destinationsByID/${TripID}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // Agrega el token como encabezado
      // },
    })
      .then(response => {
        setDestinationDetails(response.data);

        axios.get(`/api/travel/trips/destinations/${response.data.destination}/transportation-types`)
          .then(transportationResponse => {
            setTransportationTypes(transportationResponse.data);

            const totalTransportTrips = Object.values(transportationResponse.data).reduce((acc, count) => acc + count, 0);

            const transportationPercentageData = Object.entries(transportationResponse.data).map(([type, count]) => ({
              type,
              percentage: ((count / totalTransportTrips) * 100).toFixed(2),
            }));
            setTransportationPercentageData(transportationPercentageData);
          })
          .catch(error => {
            console.error('Error al obtener los tipos de transporte:', error);
          });

        axios.get(`/api/travel/trips/destinations/${response.data.destination}/accommodation-types`)
          .then(accommodationResponse => {
            setAccommodationTypes(accommodationResponse.data);

            const totalAccommodationTrips = Object.values(accommodationResponse.data).reduce((acc, count) => acc + count, 0);

            const accommodationPercentageData = Object.entries(accommodationResponse.data).map(([type, count]) => ({
              type,
              percentage: ((count / totalAccommodationTrips) * 100).toFixed(2),
            }));
            setAccommodationPercentageData(accommodationPercentageData);
          })
          .catch(error => {
            console.error('Error al obtener los tipos de alojamiento:', error);
          });
      })
      .catch(error => {
        console.error('Error al obtener los detalles del destino:', error);
      });

  }, [TripID, token]);

  const handleFavoriteClick = () => {
    // Aquí puedes agregar el código para manejar el clic en el botón de "Favorito".
    // Debes hacer una solicitud al servidor para marcar o desmarcar el destino como favorito para el usuario actual.

    // Por ejemplo:
    //if (isFavorite) {
    //   axios.delete(`/api/auth/favorite-destinations/delete`, { destination: destinationDetails.destination }, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`, // Agrega el token como encabezado
    //     },
    //   })
    //     .then(response => {
    //       setIsFavorite(false); // Actualiza el estado a true
    //     })
    //     .catch(error => {
    //       console.error('Error al agregar a favoritos:', error);
    //     });
    // } else {
      
      // Si no es favorito, realiza una solicitud para agregarlo a la lista de favoritos
      axios.post(`/api/auth/favorite-destinations`, { destination: destinationDetails.destination }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Agrega el token como encabezado
        },
      })
        .then(response => {
          //setIsFavorite(true); // Actualiza el estado a true
        })
        .catch(error => {
          console.error('Error al agregar a favoritos:', error);
        });
     // }
    };
    return (
      <div className="centered-content">
        <h2>DETALLES DEL DESTINO</h2>
        {destinationDetails ? (
          <div>
            <h3>{destinationDetails.TripID}</h3>
            <p>{`Destino nombre: ${destinationDetails.destination}`}</p>
            <button onClick={handleFavoriteClick} >Favorito
              {/*isFavorite ? 'Eliminar de favoritos' : 'Favorito'*/}
            </button>
            
          </div>
        ) : (
          <p>Cargando detalles del destino...</p>
        )}

        <h2>Porcentaje de Tipos de Transporte</h2>
        {transportationPercentageData.length > 0 ? (
          <div className="container">
            <table>
              <thead>
                <tr>
                  <th>Tipo de Transporte</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {transportationPercentageData.map(data => (
                  <tr key={data.type}>
                    <td>{data.type}</td>
                    <td>{`${data.percentage}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Cargando porcentaje de tipos de transporte...</p>
        )}

        <h2>Porcentaje de Tipos de Alojamiento</h2>
        {accommodationPercentageData.length > 0 ? (
          <div className="container">
            <table>
              <thead>
                <tr>
                  <th>Tipo de Alojamiento</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {accommodationPercentageData.map(data => (
                  <tr key={data.type}>
                    <td>{data.type}</td>
                    <td>{`${data.percentage}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Cargando porcentaje de tipos de alojamiento...</p>
        )}
      </div>
    );
  };

  export default DestinationDetail;
