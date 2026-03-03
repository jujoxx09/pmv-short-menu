import React from "react";

function Lista({ 
  cart, 
  increaseQty, 
  decreaseQty, 
  removeItem,
  clearCart,
  updateNote,
  total, 
  onOpenModal 
}) {

  return (
    <div className="lista-container">

      <div className="lista-scroll">
      {cart.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (

      cart.map(item => (
        <div key={item.id} className="lista-card">

          <video
            src={item.url}
            muted
            playsInline
            preload="metadata"
            className="lista-img"
           // style={{ width: "80%", borderRadius: "8px" }}
          />
          
          <h3>
            {item.title} {item.quantity > 1 && `x${item.quantity}`}
          </h3>

          <p>{item.description}</p>

          <p>
            {item.price}€ x {item.quantity} ={" "}
            <strong>{item.price * item.quantity}€</strong>
          </p>

          <div>
            <button onClick={() => decreaseQty(item.id)}>-</button>
            <button onClick={() => increaseQty(item.id)}>+</button>
          </div>

          {/* Nota */}
          <textarea
            placeholder="Añadir nota (sin cebolla, poco hecho...)"
            value={item.note || ""}
            onChange={(e) => updateNote(item.id, e.target.value)}
            style={{ width: "100%", marginTop: "8px" }}
          />

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => onOpenModal(item)}>
              Ver más
            </button>

            <button 
              onClick={() => removeItem(item.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Eliminar
            </button>
          </div>

        </div>
        ))
      )}
    </div>

    {cart.length > 0 && (
      <div className="lista-footer">
        <div className="total-row">
          <span>Total</span>
          <span>{total.toFixed(2)}€</span>
        </div>

        <button 
          className="clear-cart-btn"
          onClick={clearCart}
        >
          Vaciar carrito
        </button>
      </div>
    )}

    </div>
  );
}

export default Lista;