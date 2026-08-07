/*import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./header.css";
import logo from "../assets/logo.jpg"; // ajusta la ruta

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/menu");
  };

  return (
    <header className="header">

      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Mi Restaurante" />
        </Link>
      </div>


      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">Sobre nosotros</Link>
        <Link to="/delivery">Delivery</Link>
        <Link to="/booking">Reservar</Link>
        <Link to="/menu">
          Carta 🛒 ({totalItems})
        </Link>
      </nav>


      <div className="user-section">
        {!user ? (
           <>
            <Link to="/login" className="login-btnHeader">Login</Link>
            <Link to="/register" className="register-btnHeader">Register</Link>
          </>
        ) : (
          <div className="user-menu">
            <span>{user.email}</span>

            {user.role === "admin" && (
              <button onClick={() => navigate("/admin")}>
                Admin
              </button>
            )}

            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>


      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>


      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>Sobre nosotros</Link>
          <Link to="/delivery" onClick={() => setMenuOpen(false)}>Delivery</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>Reservar</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>Carta</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <button onClick={() => navigate("/admin")}>
                  Admin
                </button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}*/

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./header.css";
import logo from "../assets/logo.jpg";

import { motion } from "framer-motion";

import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaCrown,
  FaHome,
  FaInfoCircle,
  FaTruck,
  FaCalendarAlt
} from "react-icons/fa";

export default function Header() {

  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const { cart } = useCart();

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/menu");
  };

  // 🔥 inicial usuario
  const getInitial = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  return (

    <header className="header">

      {/* LOGO */}

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="logo"
      >

        <Link to="/">

          <img src={logo} alt="logo" />

        </Link>

      </motion.div>

      {/* NAV DESKTOP */}

      <nav className="nav">

        <Link to="/"><FaHome /> Home</Link>

        <Link to="/about"><FaInfoCircle /> Nosotros</Link>

        <Link to="/delivery"><FaTruck /> Delivery</Link>

        <Link to="/booking"><FaCalendarAlt /> Reservar</Link>

        <Link to="/menu">
          <FaShoppingCart />
          Carta ({totalItems})
        </Link>

      </nav>

      {/* USER */}

      <div className="user-section">

        {!user ? (

          <>
            <Link to="/login" className="login-btnHeader">
              Login
            </Link>

            <Link to="/register" className="register-btnHeader">
              Register
            </Link>
          </>

        ) : (

          <div className="user-menu">

            {/* AVATAR */}

            <div
              className={
                user.role === "admin"
                  ? "avatar admin"
                  : "avatar"
              }
            >

              {user.role === "admin" ? (
                <FaCrown />
              ) : (
                getInitial()
              )}

            </div>

            <span className="user-email">
              {user.email}
            </span>

            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            )}

            <button onClick={handleLogout}>
              Logout
            </button>

          </div>

        )}

      </div>

      {/* HAMBURGER */}

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >

        {menuOpen ? <FaTimes /> : <FaBars />}

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <motion.div
          className="mobile-menu"
          initial={{ x: 300 }}
          animate={{ x: 0 }}
        >

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            Sobre nosotros
          </Link>

          <Link to="/delivery" onClick={() => setMenuOpen(false)}>
            Delivery
          </Link>

          <Link to="/booking" onClick={() => setMenuOpen(false)}>
            Reservar
          </Link>

          <Link to="/menu" onClick={() => setMenuOpen(false)}>
            Carta ({totalItems})
          </Link>

          {!user ? (

            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>

          ) : (

            <>

              {user.role === "admin" && (
                <button onClick={() => navigate("/admin")}>
                  Admin
                </button>
              )}

              <button onClick={handleLogout}>
                Logout
              </button>

            </>

          )}

        </motion.div>

      )}

    </header>
  );
}