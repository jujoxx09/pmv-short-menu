import { useCollection } from "../../../hooks/useCollection";
import { useCart } from "../../../context/CartContext";
import { addToFavorites, removeFromFavorites } from "../../../services/favoritos";
import { addPoints } from "../../../services/user";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import "./VideosTab.css";

export default function VideosTab({ categoryFilter, user }) {
  const { items: platos, loading } = useCollection("platos", categoryFilter);
  const { addToCart } = useCart();
  const [favoritosIds, setFavoritosIds] = useState([]);

  const videoRefs = useRef([]);

   /* =========================
     FAVORITOS REALTIME
  ========================= */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "favoritos"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().platoId);
      setFavoritosIds(ids);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFavorite = async (plato) => {
    if (!user) {
      alert("Inicia sesión para añadir favoritos");
      return;
    }

    const isFav = favoritosIds.includes(plato.id);

    try {
      if (isFav) {
        await removeFromFavorites(user, plato.id);
      } else {
        await addToFavorites(user, plato);
        await addPoints(user.uid, 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     AUTOPLAY VIDEO
  ========================= */
  // 🎥 Intersection Observer para autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 } // 70% visible
    );

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [platos]);

  if (loading) return <p>Cargando vídeos...</p>;
  if (platos.length === 0) return <p>No hay vídeos disponibles</p>;

  return (
    <div className="reels-container">
      {platos.map((plato, index) => (
        <div key={plato.id} className="reel">

          {/* VIDEO */}
          <video
            ref={el => (videoRefs.current[index] = el)}
            src={plato.videoUrl}
            muted
            loop
            playsInline
            className="reel-video"
          />

          {/* INFO */}
          <div className="reel-info">
            <h3 className="reel-title">{plato.name}</h3>

            <p className="reel-desc">{plato.description}</p>

            <p className="reel-price">{plato.price} €</p>

            <p className="reel-allergens">
              {plato.allergens?.join(", ")}
            </p>
          </div>



          {/* BOTONES */}
          <div className="reel-actions">

            {/* ❤️ FAVORITO REAL */}
            <button
              className={`like-btn ${
                favoritosIds.includes(plato.id) ? "active" : ""
              }`}
              onClick={() => handleFavorite(plato)}
            >
              {favoritosIds.includes(plato.id) ? "❤️" : "🤍"}
            </button>

            {/* 🛒 CARRITO */}
            <button
              className="cart-btn"
              onClick={() => addToCart(plato)}
            >
              🛒
            </button>

          </div>

        </div>
      ))}
    </div>
  );
}