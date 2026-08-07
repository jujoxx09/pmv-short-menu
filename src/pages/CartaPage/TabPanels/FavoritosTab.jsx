/*export default function FavoritosTab() {
  return <div>Favoritos o tarjeta digital</div>;
}*/

import "./FavoritosTab.css";
import { useEffect, useState } from "react";
import { db } from "../../../services/firebase";
import { redeemCode } from "../../../services/codigos";
import { useCart } from "../../../context/CartContext";

import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function FavoritosTab({ user, setActiveTab }) {
  const [favoritos, setFavoritos] = useState([]);
  const { addToCart } = useCart();
  const [puntos, setPuntos] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [recompensasUsadas, setRecompensasUsadas] = useState([]);

  // 🔥 NIVELES
  const niveles = [
    {
      nombre: "😎 Novat@",
      puntos: 0,
      recompensa: "Sin recompensa todavía 😅",
    },
    {
      nombre: "👍 Crack",
      puntos: 50,
      recompensa: "🥤 Bebida gratis",
    },
    {
      nombre: "🧠 Geni@",
      puntos: 120,
      recompensa: "🧀 Extra queso gratis",
    },
    {
      nombre: "⚡ Máquina",
      puntos: 250,
      recompensa: "🍟 Patatas gratis",
    },
    {
      nombre: "🤖 Megatrón/a",
      puntos: 450,
      recompensa: "🔥 Doble puntos un día",
    },
    {
      nombre: "🦍 Mastodonte",
      puntos: 700,
      recompensa: "🍰 Postre gratis",
    },
    {
      nombre: "👑 Mito",
      puntos: 1000,
      recompensa: "🥪 Bocata premium",
    },
    {
      nombre: "🔥 Leyenda",
      puntos: 1500,
      recompensa: "🎁 Recompensa secreta",
    },
  ];

  // 🔥 NIVEL ACTUAL
  const getNivelActual = () => {
    return [...niveles]
      .reverse()
      .find((nivel) => puntos >= nivel.puntos);
  };

  // 🔥 SIGUIENTE NIVEL
  const getSiguienteNivel = () => {
    return niveles.find((nivel) => puntos < nivel.puntos);
  };

  // 🔥 PROGRESO
  const getProgress = () => {
    const actual = getNivelActual();
    const siguiente = getSiguienteNivel();

    if (!siguiente) return 100;

    const rango = siguiente.puntos - actual.puntos;
    const progreso = puntos - actual.puntos;

    return (progreso / rango) * 100;
  };

  // 🔥 CARGAR FAVORITOS
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "favoritos"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavoritos(data);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔥 CARGAR USUARIO
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "usuarios", user.uid);

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setPuntos(docSnap.data().puntos || 0);
        setRecompensasUsadas(docSnap.data().recompensasUsadas || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 🔥 CANJEAR CÓDIGO
  const handleRedeem = async () => {
    if (!codigo) return;

    try {
      await redeemCode(user, codigo);
      alert("Código canjeado 🎉");
      setCodigo("");
    } catch (e) {
      alert(e.message);
    }
  };

  // 🔥 ELIMINAR FAVORITO
  const removeFavorite = async (id) => {
    await deleteDoc(doc(db, "favoritos", id));
  };

  // 🔥 USAR RECOMPENSA
  const usarRecompensa = async (recompensa) => {
    const confirmar = window.confirm(
      `¿Quieres usar la recompensa "${recompensa}"?`
    );

    if (!confirmar) return;

    const ref = doc(db, "usuarios", user.uid);

    await updateDoc(ref, {
      recompensasUsadas: arrayUnion(recompensa),
    });

    alert("🎉 Recompensa usada");
  };

  if (!user) return <p>Debes iniciar sesión</p>;

  const nivelActual = getNivelActual();
  const siguienteNivel = getSiguienteNivel();

  return (
    <div className="fav-container">
      <h2 className="fav-title">❤️ A por mas puntos . . .</h2>

      {/* 🔥 PUNTOS */}
      <div className="points-card">
        <h3>⭐ Tus puntos: {puntos}</h3>

        <div className="nivel-badge">
          <h2>{nivelActual.nombre}</h2>
        </div>

        {siguienteNivel && (
          <p className="points-text">
            🔥 Te faltan {siguienteNivel.puntos - puntos} puntos para llegar a{" "}
            {siguienteNivel.nombre}
          </p>
        )}

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* 🎁 RECOMPENSAS */}
        <div className="recompensas-box">
          <h3>🎁 Recompensas desbloqueadas</h3>

          {niveles
            .filter(
              (nivel) =>
                puntos >= nivel.puntos &&
                !recompensasUsadas.includes(nivel.recompensa)
            )
            .map((nivel, index) => (
              <div key={index} className="reward-item">
                <div>
                  <p className="reward-level">{nivel.nombre}</p>
                  <p className="reward-text">{nivel.recompensa}</p>
                </div>

                {nivel.puntos !== 0 && (
                  <button
                    className="reward-btn"
                    onClick={() => usarRecompensa(nivel.recompensa)}
                  >
                    Usar
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* 🎟️ CANJEAR */}
        <div className="redeem-box">
          <h3>🎟️ Canjear código</h3>

          <input
            className="redeem-input"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Introduce tu código"
          />

          <button className="redeem-button" onClick={handleRedeem}>
            Canjear
          </button>
        </div>
      </div>

      {/* ❤️ FAVORITOS */}
      {favoritos.length === 0 ? (
        <div className="fav-empty">
  <h3>🔥 Aún no tienes favoritos</h3>
  <p>Empieza a guardar tus bocatas favoritos y crea tu ranking 🔥</p>

  <button
    className="fav-empty-btn"
    onClick={() => setActiveTab("menu")}
  >
    🍔 Ver la carta
  </button>
</div>
      ) : (
        
        <div className="fav-list">
          <h2 className="fav-title">❤️ Tus Favoritos</h2>
          {favoritos.map((fav) => (
            <div key={fav.id} className="fav-item">
              
              {/* 🎥 VIDEO */}
              {fav.videoUrl && (
                <video
                  className="fav-video"
                  src={fav.videoUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              )}

              {/* 🍔 INFO */}
              <div className="fav-info">

                <h3 className="fav-name">{fav.name}</h3>

                {fav.description && (
                  <p className="fav-description">
                    {fav.description}
                  </p>
                )}

                <p className="fav-price">
                  {fav.price} €
                </p>

                {/* 🛒 AÑADIR */}
                <button
                  className="fav-add"
                  onClick={() => addToCart(fav)}
                >
                  ➕ Añadir a la lista
                </button>

              </div>

              {/* ❌ BORRAR */}
              <button
                className="fav-delete"
                onClick={() => removeFavorite(fav.id)}
              >
                ❌
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}