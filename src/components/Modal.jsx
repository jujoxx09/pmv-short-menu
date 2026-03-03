import React, { useRef, useState } from "react";

function Modal({ dish, onClose }) {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [isClosing, setIsClosing] = useState(false);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;

    if (diff > 120) {
      // 🔥 cerrar si desliza suficiente
      setIsClosing(true);
      sheetRef.current.style.transform = `translateY(100%)`;
      setTimeout(onClose, 250);
    } else {
      // 🔥 efecto rebote
      sheetRef.current.style.transition = "transform 0.25s ease";
      sheetRef.current.style.transform = `translateY(0)`;
      setTimeout(() => {
        sheetRef.current.style.transition = "";
      }, 250);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={sheetRef}
        className={`modal-content ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="modal-handle"></div>

        <video
          src={dish.url}
          className="modal-media"
          muted
          autoPlay
          loop
          playsInline
        />

        <div className="modal-body">
          <h2>{dish.title}</h2>
          <p className="modal-price">{dish.price}€</p>
          <p className="modal-description">{dish.description}</p>

          {dish.allergens && (
            <div className="modal-allergens">
              <strong>Alérgenos</strong>
              <p>{dish.allergens}</p>
            </div>
          )}
        </div>

        {/* 🔥 botón fijo */}
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;