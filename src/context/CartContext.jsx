import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    // cargar desde localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ➕ Añadir plato
  const addToCart = (plato) => {
    
    const existing = cart.find(item => item.id === plato.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === plato.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...plato, quantity: 1, notes: "" }]);
    }
    
  };

  // ➕➖ Cambiar cantidad
  const updateQuantity = (id, amount) => {
    setCart(cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
      .filter(item => item.quantity > 0)
    );
  };

  // 📝 Añadir nota
  const updateNotes = (id, notes) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, notes } : item
    ));
  };

  // 🗑 eliminar
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 💰 total
  const total = cart.reduce((acc, item) =>
    acc + item.price * item.quantity, 0
  );

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      updateNotes,
      removeFromCart,
      total,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);