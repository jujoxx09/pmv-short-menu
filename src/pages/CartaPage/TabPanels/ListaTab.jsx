import "./ListaTab.css";

import { useState } from "react";

import { useCart } from "../../../context/CartContext";

import { db } from "../../../services/firebase";
import { auth } from "../../../services/firebase";
import { useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import {
  FaWhatsapp,
  FaPhone,
  FaMotorcycle,
  FaStore,
  FaTrash,
  FaPlus,
  FaMinus
} from "react-icons/fa";

export default function ListaTab() {

  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    total,
    clearCart
  } = useCart();


  // 🔥 DATOS DELIVERY
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [hora, setHora] = useState("");
  const [tipoPedido, setTipoPedido] = useState("delivery");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  // 🚀 HACER PEDIDO
  const handlePedido = async () => {

    if (!nombre || !telefono) {
      alert("⚠️ Completa nombre y teléfono");
      return;
    }

    if (tipoPedido === "delivery" && !direccion) {
      alert("⚠️ Introduce una dirección");
      return;
    }

    if (tipoPedido === "recoger" && !hora) {
      alert("⚠️ Introduce una hora de recogida");
      return;
    }

    if (cart.length === 0) {
      alert("⚠️ Tu carrito está vacío");
      return;
    }

    try {

      setLoading(true);

      await addDoc(collection(db, "pedidos"), {

      userId: auth.currentUser.uid, // 👈 CLAVE

      cliente: nombre,
      telefono,
      direccion,
      hora,

      tipoPedido,

      items: cart,
      total,

      estado: "pendiente",
      createdAt: Date.now(),

      });

      alert("✅ Pedido realizado correctamente");

      // 🔥 limpiar carrito
      clearCart();

      // 🔥 limpiar formulario
      setNombre("");
      setTelefono("");
      setDireccion("");
      setHora("");

    } catch (error) {

      console.error(error);

      alert("❌ Error realizando pedido");

    } finally {

      setLoading(false);

    }
  };

  // WHATSAPP
  const handleWhatsApp = () => {

    const mensaje = cart.map(item => (
      `• ${item.name} x${item.quantity}`
    )).join("%0A");

    const texto = `🍔 Nuevo pedido:%0A%0A${mensaje}%0A%0A💰 Total: ${total.toFixed(2)}€`;

    window.open(
      `https://wa.me/34633087950?text=${texto}`,
      "_blank"
    );
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">

        <div className="empty-card">

          <h2>🍔 Tu lista está vacía</h2>

          <p>
            Descubre nuestras hamburguesas smash,
            entrantes brutales y postres irresistibles 🔥
          </p>

          <button
            className="empty-btn"
            onClick={() => navigate("/menu?tab=menu")}
          >
            Ver menú
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-container">

      {/* 🍔 ITEMS */}
      {cart.map(item => (
        <div key={item.id} className="cart-item">

          {/* 🎥 VIDEO */}
          {item.videoUrl && (
            <video
              className="cart-video"
              src={item.videoUrl.replace(
                "/upload/",
                "/upload/q_auto,f_auto,w_300/"
              )}
              onClick={(e) => {
                const video = e.target;
                video.paused
                  ? video.play()
                  : video.pause();
              }}
            />
          )}

          {/* 📦 CONTENIDO */}
          <div className="cart-content">

            <h3 className="cart-title">
              {item.name}
            </h3>

            <p className="cart-desc">
              {item.description}
            </p>

            {item.allergens && (
              <p className="cart-allergens">
                {item.allergens.join(", ")}
              </p>
            )}

            {/* 💰 PRECIO */}
            <p className="cart-price">
              {item.price}€ x {item.quantity} ={" "}
              <strong>
                {(item.price * item.quantity).toFixed(2)}€
              </strong>
            </p>

            {/* ➕➖ CANTIDAD */}
            <div className="cart-qty">

              <button
                onClick={() =>
                  updateQuantity(item.id, -1)
                }
              >
                <FaMinus />
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.id, 1)
                }
              >
                <FaPlus />
              </button>

            </div>

            {/* 📝 NOTAS */}
            <input
              className="cart-input"
              placeholder="Añadir nota (sin cebolla, poco hecho...)"
              value={item.notes}
              onChange={(e) =>
                updateNotes(item.id, e.target.value)
              }
            />

            {/* DELETE */}
            <button
              className="cart-delete"
              onClick={() => removeFromCart(item.id)}
            >
              <FaTrash /> Eliminar
            </button>

          </div>

        </div>
      ))}

      {/* 💰 TOTAL */}
      <div className="cart-total">

        <span>Total</span>

        <span>
          {total.toFixed(2)} €
        </span>

      </div>
      
     {/* aqui le indico que si le damos a realizar pedido se muestre el formulario para introducir 
      los datos de entrega o recogida */}
      
      {showForm && (
      <div className="delivery-form">
      {/* TIPO PEDIDO */}
      <div className="order-types">

        <button
          className={tipoPedido === "delivery" ? "active" : ""}
          onClick={() => setTipoPedido("delivery")}
        >
          <FaMotorcycle /> A domicilio
        </button>

        <button
          className={tipoPedido === "recoger" ? "active" : ""}
          onClick={() => setTipoPedido("recoger")}
        >
          <FaStore /> Recoger
        </button>

      </div>

      {/* =========================
          🚚 DELIVERY FORM
      ========================= */}
      

        <h2>
          {tipoPedido === "delivery"
            ? "🚚 Datos de entrega"
            : "🛍️ Datos de recogida"
          }
        </h2>

        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) =>
            setTelefono(e.target.value)
          }
        />

        {tipoPedido === "delivery" ? (
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        ) : (
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        )}

      </div>
      )}

      {/* ACTIONS */}
      <div className="order-actions">

        {!showForm ? (

    <button
      className="cart-order"
      onClick={() => setShowForm(true)}
    >
      Realizar pedido 🚀
    </button>

  ) : (

    <button
      className="cart-order"
      onClick={handlePedido}
      disabled={loading}
    >
      {loading
        ? "Enviando..."
        : "Enviar pedido 🚀"
      }
    </button>

  )}

        <button
          className="whatsapp-btn"
          onClick={handleWhatsApp}
        >
          <FaWhatsapp /> Pedir por WhatsApp
        </button>

        <a
          href="tel:+34 671147254"
          className="call-btn"
        >
          <FaPhone /> Llamar al local
        </a>

      </div>

      {/* CLEAR */}
      <button
        className="cart-clear"
        onClick={clearCart}
      >
        Vaciar carrito
      </button>

    </div>
  );
}