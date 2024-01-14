// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';
const Header = () => {
  return (
    <header className="header">
      <h1>VIAWEB</h1>
      
      <h3>~PÁGINA WEB DE ESTADÍSTICAS DE VIAJES~</h3>
      <hr className="separator" />
      <div className="menu-container">
        <nav className="menu">
          <Link to="/home">Inicio</Link>
          <Link to="/destinos">Destinos</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
