/*export default function FavoritosTab() {
  return <div>Favoritos o tarjeta digital</div>;
}
*/
import "./FavoritosTab.css";
import { useEffect, useState } from "react";
import { db } from "../../../services/firebase";
import { redeemCode } from "../../../services/codigos";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function FavoritosTab({ user }) {
  const [favoritos, setFavoritos] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [codigo, setCodigo] = useState("");

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

  //obtener puntos
    useEffect(() => {
    if (!user) return;

    const ref = doc(db, "usuarios", user.uid);

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setPuntos(docSnap.data().puntos || 0);
      }
    });

    return () => unsubscribe();
  }, [user]);

    const getNivel = (puntos) => {
    if (puntos >= 150) return "🥇 Gold";
    if (puntos >= 50) return "🥈 Silver";
    return "🥉 Bronze";
  };

    // 📊 Progreso
  const getProgress = (puntos) => {
    if (puntos < 50) return (puntos / 50) * 100;
    if (puntos < 150) return ((puntos - 50) / 100) * 100;
    return 100;
  };


  const removeFavorite = async (id) => {
    await deleteDoc(doc(db, "favoritos", id));
  };

  if (!user) return <p>Debes iniciar sesión</p>;



  return (
    <div className="fav-container">
      <h2 className="fav-title">❤️ Tus Favoritos</h2>


      {/* ⭐ BLOQUE DE PUNTOS */}
      <div className="points-card">
        <h3>⭐ Tus puntos: {puntos}</h3>
        <p className="points-level">{getNivel(puntos)}</p>
        
        <p className="points-text">
        🔥 Te faltan{" "}
        {puntos < 50
          ? 50 - puntos
          : puntos < 150
          ? 150 - puntos
          : 0}{" "}
        puntos para el siguiente nivel
      </p>

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

        <div className="progress-bar">
          <div
          className="progress-fill"
          style={{ width: `${getProgress(puntos)}%` }}
        />
        </div>
      </div>

      {/* ❤️ FAVORITOS */}
      {favoritos.length === 0 ? (
        <p>No tienes favoritos todavía ❤️</p>
      ) : (
        <div className="fav-list">
        {favoritos.map((fav) => (
          <div key={fav.id} className="fav-item">

            <div className="fav-left">
              {fav.imagen && (
                <img
                  className="fav-img"
                  src={fav.imagen}
                  alt={fav.nombre}
                />
              )}

              <p className="fav-name">{fav.nombre}</p>
            </div>

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