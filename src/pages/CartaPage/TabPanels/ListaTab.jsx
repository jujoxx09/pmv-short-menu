import "./ListaTab.css";
import { useCart } from "../../../context/CartContext";

export default function ListaTab() {

  const {
    cart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    total,
    clearCart
  } = useCart();

  if (cart.length === 0) return <p>No hay platos en la lista</p>;

  return (
    <div className="cart-container">
      {cart.map(item => (
        <div key={item.id} className="cart-item">

          {/* 🎥 VIDEO IZQUIERDA */}
          {item.videoUrl && (
            <video
              className="cart-video"
              src={item.videoUrl.replace(
                "/upload/",
                "/upload/q_auto,f_auto,w_300/"
              )}
              onClick={(e) => {
                const video = e.target;
                video.paused ? video.play() : video.pause();
              }}
            />
          )}

          {/* 📦 CONTENIDO DERECHA */}
          <div className="cart-content">

            <h3 className="cart-title">{item.name}</h3>

            <p className="cart-desc">{item.description}</p>

            {item.allergens && (
              <p className="cart-allergens">
                {item.allergens.join(", ")}
              </p>
            )}

            <p className="cart-price">
              {item.price}€ x {item.quantity} ={" "}
              <strong>{(item.price * item.quantity).toFixed(2)}€</strong>
            </p>

            {/* ➕➖ cantidad */}
            <div className="cart-qty">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>

            {/* 📝 notas */}
            <input
              className="cart-input"
              placeholder="Añadir nota (sin cebolla, poco hecho...)"
              value={item.notes}
              onChange={(e) => updateNotes(item.id, e.target.value)}
            />

            {/* 🔻 FOOTER */}
            <div className="cart-footer">
              {/* <button className="cart-more">Ver más</button>*/}

              <button
                className="cart-delete"
                onClick={() => removeFromCart(item.id)}
              >
                Eliminar
              </button>
            </div>

          </div>
        </div>
      ))}

      {/* 💰 TOTAL */}
      <div className="cart-total">
        <span>Total</span>
        <span> {total.toFixed(2)} €</span>
      </div>

      {/* 🧹 BOTON VACIAR (opcional pero recomendado) */}
      <button
        className="cart-clear"
         onClick={clearCart}
      >
        Vaciar carrito
      </button>

    </div>
  );
}