import { useCollection } from "../../../hooks/useCollection";
import { useCart } from "../../../context/CartContext";
import { addToFavorites, removeFromFavorites } from "../../../services/favoritos";
import { useEffect, useState, useRef } from "react";
import { db } from "../../../services/firebase";
import { addPoints } from "../../../services/user";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaPlus, FaPlay } from "react-icons/fa";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import "./MenuTabs.css";


export default function MenuTab({ categoryFilter, user })  {
  const navigate = useNavigate();
  const { items: platos, loading } = useCollection("platos", categoryFilter);
  const { addToCart } = useCart(); // para añadir el carrito
  const [favoritosIds, setFavoritosIds] = useState([]);
  const videoRefs = useRef({});
  const [activeVideo, setActiveVideo] = useState(null);

  const handlePlay = (id) => {
  const currentVideo = videoRefs.current[id];



  if (!currentVideo) return;

  // Si hay otro video reproduciéndose, lo pausamos
  Object.entries(videoRefs.current).forEach(([key, video]) => {
    if (video && key !== id) {
      video.pause();
    }
  });

  // Toggle play/pause del seleccionado
  if (currentVideo.paused) {
    currentVideo.play();
    setActiveVideo(id);
  } else {
    currentVideo.pause();
    setActiveVideo(null);
  }
};

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

  const handleFavorite = async (plato) => {console.log("USER:", user);
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

  if (loading) return <p>Cargando...</p>;

  return (
  <div className="menu-grid">
    {platos.map(plato => (
      <div key={plato.id} className="menu-card">

        {plato.videoUrl && (
          <div className="video-wrapper">
            <video
              src={plato.videoUrl}
              ref={(el) => (videoRefs.current[plato.id] = el)}
              onClick={() => handlePlay(plato.id)}
              className="menu-video"
            />
            {activeVideo !== plato.id && (
              <button
                className="play-overlay"
                onClick={() => handlePlay(plato.id)}
              >
                <FaPlay />
              </button>
            )}
          </div>
        )}

        <div className="menu-content">
          <div className="menu-info">
            <h3
              className="menu-title"
              onClick={() => navigate(`/plato/${plato.id}`)}
            >
              {plato.name}
            </h3>
            <p className="menu-desc">{plato.description}</p>

            <p className="menu-price">{plato.price} €</p>
            <p className="menu-category">{plato.category}</p>

            <p className="menu-allergens">
              {plato.allergens.join(", ")}
            </p>
          </div>

          <div className="menu-actions">
            <button
              className="menu-button cart"
              onClick={() => addToCart(plato)}
              >
                <FaPlus /> Añadir
              </button>

            <button
              className={`menu-button fav ${
                favoritosIds.includes(plato.id) ? "active" : ""
              }`}
              onClick={() => handleFavorite(plato)}
            >
              {favoritosIds.includes(plato.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

      </div>
    ))}
  </div>
  );
}