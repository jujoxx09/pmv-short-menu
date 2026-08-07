import { useState } from "react";
import "./Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login correcto", userCredential.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
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

        <input
          className="login-input"
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={login}
        >
          Entrar 🚀
        </button>

      </div>

    </div>
  );
}

export default Login;