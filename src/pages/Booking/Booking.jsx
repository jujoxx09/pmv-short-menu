import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import "./Reservas.css";

const HORAS = [
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

export default function Booking() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [personas, setPersonas] = useState(2);
  const [fecha, setFecha] = useState("");

  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  const [horasDisponibles, setHorasDisponibles] = useState(HORAS);

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🔥 Cargar horas disponibles
  useEffect(() => {
    if (!fecha) return;

    const cargarReservas = async () => {
      try {
        const q = query(
          collection(db, "reservas"),
          where("fecha", "==", fecha)
        );

        const snapshot = await getDocs(q);

        const reservasDelDia = snapshot.docs.map((doc) =>
          doc.data()
        );

        // ✅ máximo 2 reservas por hora
        const horasLibres = HORAS.filter((hora) => {
          const reservasEnHora = reservasDelDia.filter(
            (r) => r.hora === hora
          );

          return reservasEnHora.length < 2;
        });

        setHorasDisponibles(horasLibres);

        // 🔥 si la hora seleccionada ya no existe
        if (
          horaSeleccionada &&
          !horasLibres.includes(horaSeleccionada)
        ) {
          setHoraSeleccionada(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    cargarReservas();
  }, [fecha, horaSeleccionada]);

  // 🍔 Reservar
  const reservarMesa = async () => {
    if (
      !nombre ||
      !telefono ||
      !email ||
      !fecha ||
      !horaSeleccionada
    ) {
      setMensaje("⚠️ Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setMensaje("");

      // 🔥 comprobar otra vez antes de guardar
      const q = query(
        collection(db, "reservas"),
        where("fecha", "==", fecha),
        where("hora", "==", horaSeleccionada)
      );

      const snapshot = await getDocs(q);

      // ✅ máximo 2 reservas
      if (snapshot.docs.length >= 2) {
        setMensaje("❌ Esa hora ya está completa");
        setLoading(false);
        return;
      }

      // ✅ guardar reserva
      await addDoc(collection(db, "reservas"), {
        nombre,
        telefono,
        email,
        personas,
        fecha,
        hora: horaSeleccionada,
        createdAt: Date.now(),
      });

      setMensaje("✅ Reserva realizada correctamente");

      // limpiar formulario
      setNombre("");
      setTelefono("");
      setEmail("");
      setFecha("");
      setHoraSeleccionada(null);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al realizar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservas-page">
      <div className="reservas-card">
        <h1>🍔 Reserva tu mesa</h1>

        <p>
          Elige tu hora, junta a tu gente y ven con hambre 😎
        </p>

        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <select
          value={personas}
          onChange={(e) => setPersonas(e.target.value)}
        >
          <option value="1">1 persona</option>
          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5 personas</option>
          <option value="6">6 personas</option>
          <option value="7">7 personas</option>
          <option value="8">8 personas</option>
        </select>

        {/* ⏰ HORAS */}
        <div className="horas-container">
          {horasDisponibles.length > 0 ? (
            horasDisponibles.map((hora) => (
              <button
                key={hora}
                className={
                  horaSeleccionada === hora
                    ? "hora-btn active"
                    : "hora-btn"
                }
                onClick={() => setHoraSeleccionada(hora)}
              >
                {hora}
              </button>
            ))
          ) : (
            <p>No quedan horas disponibles 😢</p>
          )}
        </div>

        {/* 🚀 BOTÓN */}
        <button
          className="reservar-btn"
          onClick={reservarMesa}
          disabled={loading}
        >
          {loading ? "Reservando..." : "Reservar mesa 🚀"}
        </button>

        {/* 💬 MENSAJE */}
        {mensaje && (
          <p className="mensaje">{mensaje}</p>
        )}
      </div>
    </div>
  );
}