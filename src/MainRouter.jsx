import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";          // Tu Carta con videos, menú y lista
import Home from "./components/Home";
import Delivery from "./components/Delivery";
import Reservar from "./components/Reservar";
import Nosotros from "./components/Nosotros";

function MainRouter() {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Home />} />

        {/* Otras rutas */}
        <Route path="/carta" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;