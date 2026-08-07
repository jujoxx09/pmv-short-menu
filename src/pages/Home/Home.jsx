import "./Home.css";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaFire,
  FaStar,
  FaShoppingCart,
  FaHamburger,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaClock,
  FaPepperHot,
  FaHeart
} from "react-icons/fa";

export default function Home() {

  return (

    <div className="home">

      {/* HERO */}
      <section className="hero">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-content"
        >

          <motion.div
            className="hero-badge"
            whileHover={{ scale: 1.05 }}
          >
            <FaMapMarkerAlt />
            A 2 min de la uni
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaHamburger className="hero-icon" />

            Bocatas y burgers
            que salvan exámenes

            <FaFire className="hero-icon fire" />
          </motion.h1>

          <p>
            Bocatería urbana pensada para universitarios.
            Smash burgers, bocatas brutales, precios estudiantes
            y comida lista en minutos.
          </p>

          <div className="hero-features">

            <div>
              <FaClock />
              Rápido
            </div>

            <div>
              <FaPepperHot />
              Smash & spicy
            </div>

            <div>
              <FaUserGraduate />
              Student vibes
            </div>

          </div>

          <div className="hero-buttons">

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link to="/menu" className="btn-primary">
                <FaHamburger />
                Ver carta
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link to="/menu?tab=favoritos"className="btn-secondary">
                <FaHeart />
                Tus favoritos
              </Link>
            </motion.div>

          </div>

        </motion.div>

      </section>

      {/* DESTACADOS */}
      <section className="featured">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <FaStar />
          Lo más pedido esta semana
        </motion.h2>

        <div className="cards">

          <motion.div
            className="card"
            whileHover={{
              y: -8,
              scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="card-icon">
              <FaHamburger />
            </div>

            <h3>Smash Clásica</h3>

            <p>
              Pan brioche, cheddar fundido
              y salsa secreta de la casa.
            </p>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{
              y: -8,
              scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="card-icon">
              <FaPepperHot />
            </div>

            <h3>Chicken Boom</h3>

            <p>
              Pollo crispy con toque spicy
              que engancha desde el primer mordisco.
            </p>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{
              y: -8,
              scale: 1.02
            }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="card-icon">
              <FaFire />
            </div>

            <h3>La Bestia</h3>

            <p>
              Doble smash, doble cheddar
              y cero arrepentimientos.
            </p>
          </motion.div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0}}
          transition={{ duration: 0.6 }}
        >

          <h2>
            ¿Hambre después de clase?
          </h2>

          <p>
            Pide online y recógelo en minutos.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/menu" className="btn-primary big">
              <FaShoppingCart />
              Pedir ahora
            </Link>
          </motion.div>

        </motion.div>

      </section>

    </div>
  );
}