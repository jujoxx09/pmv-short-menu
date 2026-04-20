import { Link, useNavigate } from "react-router-dom";
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
    navigate("/login");
  };

  return (
    <header className="header">
      {/* LOGO */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Mi Restaurante" />
        </Link>
      </div>

      {/* NAV DESKTOP */}
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/about">Sobre nosotros</Link>
        <Link to="/delivery">Delivery</Link>
        <Link to="/booking">Reservar</Link>
        <Link to="/menu">
          Carta 🛒 ({totalItems})
        </Link>
      </nav>

      {/* USER */}
      <div className="user-section">
        {!user ? (
           <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
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

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* MOBILE MENU */}
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
}