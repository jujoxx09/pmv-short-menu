import { useState } from "react";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleRegister}>
      <h1>Registro</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Registrarse</button>
    </form>
  );
}