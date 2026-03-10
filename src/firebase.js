import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD88QMZmrazsgTxnfUKpKFMk-EscK8IvJo",
  authDomain: "menu-digital-d66bb.firebaseapp.com",
  projectId: "menu-digital-d66bb",
  storageBucket: "menu-digital-d66bb.firebasestorage.app",
  messagingSenderId: "273018047339",
  appId: "1:273018047339:web:4c9804e8a63ac25dab9a2e"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Exporta auth correctamente
export const auth = getAuth(app);

// También puedes exportar la app si quieres
export default app;