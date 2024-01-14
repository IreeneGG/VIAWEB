import React from 'react';
import '../../styles/Home.css';
import logo from './logo.png';

const Home = () => (
  <main className="home-container" role="main">
    <header>
      <h1 className="home-title">BIENVENIDO</h1>
    </header>
    <section className="content-container">
      <article className="text-container">
        <h2 className="home-subtitle">
          Tu plataforma de estadísticas de viajes, donde podrás consultar distintas
          informaciones sobre los destinos más visitados en los últimos 3 años.
          <br /><br />
          Descubre lugares increíbles, analiza tendencias y añade tus destinos favoritos a tu lista.
        </h2>
      </article>
      <figure>
        <img className="home-logo" src={logo} alt="Logo de la plataforma" />
      </figure>
    </section>
  </main>
);

export default Home;
