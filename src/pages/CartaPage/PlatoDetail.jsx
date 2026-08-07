import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

import "./PlatoDetail.css";

import { db } from "../../services/firebase";
import { useCart } from "../../context/CartContext";

export default function PlatoDetail({ user }) {

  const { id } = useParams();

  const getInitial = (email) => {
  return email ? email.charAt(0).toUpperCase() : "?";
};
  const [plato, setPlato] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Añadir al carrito
  const { addToCart } = useCart();

  //para navegar
  const navigate = useNavigate();

  // para ver el video
  const toggleVideo = (e) => {
  const video = e.currentTarget;

  if (video.paused) {
    video.play();
    setIsPlaying(true);
  } else {
    video.pause();
    setIsPlaying(false);
  }
};

  // Definir el tiempo de las reseñas
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();

    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "hoy";
    if (diff === 1) return "ayer";
    if (diff < 7) return `hace ${diff} días`;
    if (diff < 30) return `hace ${Math.floor(diff / 7)} semana(s)`;
    return `hace ${Math.floor(diff / 30)} mes(es)`;
  };

  // Obtener plato
  useEffect(() => {

    const fetchPlato = async () => {

      const docRef = doc(db, "platos", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setPlato({
          id: snap.id,
          ...snap.data()
        });
      }
    };

    fetchPlato();

  }, [id]);

  // Obtener reviews realtime
  useEffect(() => {

    const q = query(
      collection(db, "reviews"),
      where("platoId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setReviews(data);

    });

    return () => unsubscribe();

  }, [id]);

  // Añadir review
  const handleReview = async () => {

    if (!user) {
      alert("Inicia sesión");
      return;
    }

    if (!text.trim()) return;

    await addDoc(collection(db, "reviews"), {
      platoId: id,
      userId: user.uid,
      userName: user.email || "Usuario",
      text,
      rating,
      createdAt: serverTimestamp()
    });

    setText("");
    setRating(5);
  };

  // Eliminar review
  const handleDeleteReview = async (reviewId) => {

    const confirmDelete = window.confirm(
      "¿Eliminar esta reseña?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(doc(db, "reviews", reviewId));

    } catch (error) {
      console.error(error);
    }
  };

  // Media estrellas
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  if (!plato) return <p>Cargando...</p>;

  return (

    

    <div className="plato-detail">

      <button  className="back-button" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      

      <h1>{plato.name}</h1>

      {/* VIDEO */}
      <video
        src={plato.videoUrl}
        muted
        playsInline
        className="detail-video"
        onClick={toggleVideo}
      />

      {/* INFO */}
      <div className="detail-info">

        

        <p className="detail-description">
          {plato.description}
        </p>

        <p className="detail-price">
          {plato.price} €
        </p>

        <div className="detail-rating">
          ⭐ {averageRating} ({reviews.length} reseñas)
        </div>

        <button
          className="cart-button"
          onClick={() => addToCart(plato)}
        >
          Añadir al carrito
        </button>

      </div>

      {/* REVIEWS */}
      <div className="reviews-section">

        <h2>Reseñas</h2>

        {/* FORM */}
        <div className="review-form">

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe una reseña..."
          />

          {/* ESTRELLAS */}
          <div className="stars-selector">

            {[1,2,3,4,5].map((star) => (

              <span
                key={star}
                className={
                  star <= rating
                    ? "star active"
                    : "star"
                }
                onClick={() => setRating(star)}
              >
                ★
              </span>

            ))}

          </div>

          <button onClick={handleReview}>
            Publicar reseña
          </button>

        </div>

        {/* LISTA */}
        <div className="reviews-list">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="review-card"
            >

              <div className="review-header">

                <div className="user-info">

                  <div className="avatar">
                    {getInitial(review.userName)}
                  </div>

                  <div className="user-meta">

                    <strong>{review.userName}</strong>

                    <div className="review-stars">
                      {"★".repeat(review.rating)}
                    </div>

                  </div>

                </div>

              </div>

              <span className="review-date">
                {formatTime(review.createdAt)}
              </span>

              <p className="review-text">
                {review.text}
              </p>

              {/* ELIMINAR SOLO OWNER */}
              {user?.uid === review.userId && (

                <button
                  className="delete-review"
                  onClick={() =>
                    handleDeleteReview(review.id)
                  }
                >
                  Eliminar
                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}