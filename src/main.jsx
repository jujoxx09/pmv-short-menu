import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './app/App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import './index.css';



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);