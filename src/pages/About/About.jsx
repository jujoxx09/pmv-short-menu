import "./About.css";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaHamburger,
  FaFire,
  FaUsers,
  FaRocket,
  FaHeart,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaStar
} from "react-icons/fa";

export default function About() {

  return (

    <div className="about">

      {/* HERO */}

      <section className="about-hero">

        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <motion.div
            className="hero-badge"
            whileHover={{ scale: 1.05 }}
          >
            <FaMapMarkerAlt />
            Bocatería universitaria
          </motion.div>

          <h1>
            <FaHamburger className="hero-icon" />

            Mucho más
            que un bocata

            <FaFire className="hero-icon fire" />
          </h1>

          <p>
            Somos el sitio al que vienes después de clase,
            antes de salir o cuando simplemente necesitas
            algo brutal para comer.
          </p>

        </motion.div>

      </section>

      {/* HISTORIA */}

      <section className="about-story">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div className="section-title">

            <FaHeart />

            <h2>Nuestra historia</h2>

          </div>

          <div className="story-card">

            <p>
              Todo empezó cerca de la universidad,
              entre clases, hambre y ganas de crear
              un sitio diferente.
            </p>

            <p>
              Queríamos una bocatería rápida,
              con precios estudiantes,
              comida brutal y ambiente real.
            </p>

            <p>
              Nada de postureo:
              buen pan,
              ingredientes top
              y recetas que enganchan.
            </p>

          </div>

        </motion.div>

      </section>

      {/* VALORES */}

      <section className="about-values">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          <div className="section-title">

            <FaStar />

            <h2>Lo que nos define</h2>

          </div>

          <div className="values-grid">

            <motion.div
              className="value-card"
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              transition={{
                type: "spring",
                stiffness: 220
              }}
            >

              <div className="value-icon">
                <FaFire />
              </div>

              <h3>Comida real</h3>

              <p>
                Bocatas, burgers y smash
                hechas para disfrutar.
              </p>

            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              transition={{
                type: "spring",
                stiffness: 220
              }}
            >

              <div className="value-icon">
                <FaUsers />
              </div>

              <h3>Buen ambiente</h3>

              <p>
                El sitio donde siempre
                acabas quedándote más tiempo.
              </p>

            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              transition={{
                type: "spring",
                stiffness: 220
              }}
            >

              <div className="value-icon">
                <FaUserGraduate />
              </div>

              <h3>Student vibes</h3>

              <p>
                Cerca de la uni,
                rápido y pensado
                para estudiantes.
              </p>

            </motion.div>

            <motion.div
              className="value-card"
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              transition={{
                type: "spring",
                stiffness: 220
              }}
            >

              <div className="value-icon">
                <FaRocket />
              </div>

              <h3>Siempre mejorando</h3>

              <p>
                Nuevos sabores,
                nuevas ideas
                y cero aburrimiento.
              </p>

            </motion.div>

          </div>

        </motion.div>

      </section>

      {/* CTA */}

      <section className="about-cta">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h2>
            Ahora ya sabes quiénes somos
          </h2>

          <p>
            Solo falta que pruebes el menú.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >

            <Link
              to="/menu"
              className="btn-primary big"
            >
              <FaHamburger />
              Ver carta
            </Link>

          </motion.div>

        </motion.div>

      </section>

    </div>
  );
}
