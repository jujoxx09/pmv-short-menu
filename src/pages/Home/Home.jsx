import "./Home.css";

import { Link } from "react-router-dom";



export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <h1>🔥 Las burgers que te hacen volver 🔥</h1>
        <p>
          Aquí no venimos a comer… venimos a disfrutar. Smash burgers, queso
          derritiéndose y vibes de las buenas.
        </p>

        <div className="hero-buttons">
          <Link to="/menu"  className="btn-primary">Ver la carta 🍔</Link>
          <Link to="/favoritos" className="btn-secondary">
            Tus favs ⭐
          </Link>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="featured">
        <h2>Lo más top ahora mismo 👀</h2>

        <div className="cards">
          <div className="card">
            <h3>La Clásica</h3>
            <p>Pan brioche, carne smash, cheddar y nuestra salsa secreta.</p>
          </div>

          <div className="card">
            <h3>La Bestia</h3>
            <p>Doble carne, doble queso… y cero arrepentimientos.</p>
          </div>

          <div className="card">
            <h3>Chicken Boom</h3>
            <p>Pollo crujiente con toque spicy que engancha.</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <h2>¿Listo para darte un homenaje? 😏</h2>
        <a href="/carta" className="btn-primary big">
          Pedir ahora 🚀
        </a>
      </section>
    </div>
  );
}