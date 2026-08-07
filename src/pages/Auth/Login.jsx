import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="login-title">
          🍔 Burger Login
        </h1>

        <p className="login-subtitle">
          Entra y pide tu burger favorita 😎
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
          className="login-btn" 
          type="submit">
            Entrar 🚀
          </button>
        </form>
      </div>
    </div>
  );
}