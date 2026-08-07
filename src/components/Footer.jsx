import "./Footer.css";

import { motion } from "framer-motion";

import {
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaClock,
  FaHamburger,
  FaHeart,
  FaEnvelope
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Footer() {

  return (

    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}

        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="footer-logo">

            <FaHamburger />

            <h2>PMV Bocatas</h2>

          </div>

          <p>
            Bocatas, burgers y buen rollo
            a dos pasos de la universidad.
          </p>

          <div className="footer-socials">

            <motion.a
              whileHover={{
                scale: 1.15,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              href="#"
            >
              <FaInstagram />
            </motion.a>

            <motion.a
              whileHover={{
                scale: 1.15,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              href="#"
            >
              <FaTiktok />
            </motion.a>

          </div>

        </motion.div>

        {/* LINKS */}

        <motion.div
          className="footer-links"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >

          <h3>Explorar</h3>

          <Link to="/">
            Inicio
          </Link>

          <Link to="/menu">
            Carta
          </Link>

          <Link to="/about">
            Sobre nosotros
          </Link>

          <Link to="/menu?tab=favoritos">
            Favoritos
          </Link>

        </motion.div>

        {/* INFO */}

        <motion.div
          className="footer-info"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >

          <h3>Información</h3>

          <div className="footer-item">

            <FaMapMarkerAlt />

            <span>
              Cerca de la universidad
            </span>

          </div>

          <div className="footer-item">

            <FaClock />

            <span>
              Lun - Dom · 12:00 - 00:00
            </span>

          </div>

          <div className="footer-item">

            <FaEnvelope />

            <span>
              contacto@pmvbocatas.com
            </span>

          </div>

        </motion.div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 PMV Bocatas ·
          Hecho con <FaHeart className="heart" />
        </p>

      </div>

    </footer>
  );
}
