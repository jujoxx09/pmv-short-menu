import React from "react";
import logo from "../assets/FREEDOM.png"; // tu logo

function Home({ onGoToCarta }) {
  return (
    <div className="home-page">
      {/* Logo arriba */}
      <div className="home-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Menú tipo lista */}
      <nav className="home-menu">
        <ul>
          <li>
            <button onClick={onGoToCarta}>Carta</button>
          </li>
          <li>
            <button>Sobre Nosotros</button>
          </li>
          <li>
            <button>Delivery</button>
          </li>
          <li>
            <button>Reservar</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;


