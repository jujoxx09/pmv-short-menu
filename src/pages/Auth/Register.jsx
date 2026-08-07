import { useState } from "react";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 guardar en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user" // por defecto
      });

      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1 className="register-title">
          🍔 Crear cuenta
        </h1>
        
        <p className="register-subtitle">
          Únete y empieza a pedir burgers épicas 😎
        </p>
        <form onSubmit={handleRegister}>
          <input
            className="register-input"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="register-input"
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="register-btn" type="submit">
            Registrarse 🚀
          </button>
        </form>

      </div>
    </div>
  );
}