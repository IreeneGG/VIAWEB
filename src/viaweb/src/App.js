
import React, { useState } from 'react';
import TripList from './components/Destinos/TripList';
import Header from './components/Header/Header.js';
import Destinos from './components/Destinos/Destinos.js';
import DestinationDetail from './components/Destinos/DestinationDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Home from  './components/Destinos/Home.js'
import Profile from  './components/Destinos/Profile.js'
import Login from './components/Login/Login.js'; 
import { useToken } from './components/Login/TokenContext';

// const Home = () => (
//   <div className="home-container">
//     <h2 className="home-title">BIENVENIDO </h2>
//     <div className="content-container">
//       <div className="text-container">
//         <p className="home-subtitle">
//           Tu plataforma de estadísticas de viajes, donde podrás consultar distintas<br /> informaciones sobre los destinos más visitados en los últimos 3 años.
//           <br /><br />
//           Descubre lugares increíbles, analiza tendencias y <br />añade tus destinos favoritos a tu lista.
//         </p>    </div>
//       <img className="home-logo" src={logo} alt="Logo" />
//     </div>
//   </div>
// );



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar la autenticación exitosa
  const handleLogin = () => {
    setIsAuthenticated(true);
   
    console.log("AUTHENTIFICARED:",isAuthenticated);
  };
  return (
    <Router>
      <div className="App">
        {/* Usar el componente Header */}
        {isAuthenticated && <Header />}

        {/* Usar el componente Routes */}
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/destinations/:TripID" element={<DestinationDetail />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
