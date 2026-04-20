/*import { useState } from "react";
import CartaTabs from "./CartaTabs";

import VideosTab from "./TabPanels/VideosTab";
import MenuTab from "./TabPanels/MenuTab";
import ListaTab from "./TabPanels/ListaTab";
import FavoritosTab from "./TabPanels/FavoritosTab";

export default function CartaPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [categoryFilter, setCategoryFilter] = useState(null);

  return (
    <div>
      <h1>Carta</h1>

      <CartaTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCategoryFilter={setCategoryFilter}
      />

      {activeTab === "videos" && (
        <VideosTab categoryFilter={categoryFilter} />
      )}

      {activeTab === "menu" && (
        <MenuTab categoryFilter={categoryFilter} />
      )}

      {activeTab === "lista" && <ListaTab />}

      {activeTab === "favoritos" && <FavoritosTab />}
    </div>
  );
}*/

import { useState, useEffect } from "react";
import { auth } from "../../services/firebase"; // ajusta la ruta si hace falta
import { createUserIfNotExists } from "../../services/user";

import { onAuthStateChanged } from "firebase/auth";

import CartaTabs from "./CartaTabs";

import VideosTab from "./TabPanels/VideosTab";
import MenuTab from "./TabPanels/MenuTab";
import ListaTab from "./TabPanels/ListaTab";
import FavoritosTab from "./TabPanels/FavoritosTab";

export default function CartaPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [user, setUser] = useState(null);

  // 🔐 Detectar usuario logueado
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      await createUserIfNotExists(currentUser);
    }
  });

  return () => unsubscribe();
}, []);

  return (
     <div >
      <CartaTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCategoryFilter={setCategoryFilter}
        user={user} // 👈 importante para bloquear desde tabs si quieres
      />

      {/* 🎥 VIDEOS */}
      {activeTab === "videos" && (
        <VideosTab user={user} categoryFilter={categoryFilter} />
      )}

      {/* 🍽️ MENU */}
      {activeTab === "menu" && (
        <MenuTab user={user} categoryFilter={categoryFilter} />
      )}

      {/* 🛒 LISTA */}
      {activeTab === "lista" && <ListaTab user={user} />}

      {/* ❤️ FAVORITOS */}
      {activeTab === "favoritos" && (
        user ? (
          <FavoritosTab user={user} />
        ) : (
          <div >
            <p>🔒 Debes iniciar sesión para ver tus favoritos</p>
            <button onClick={() => alert("Redirigir a login")}>
              Iniciar sesión
            </button>
          </div>
        )
      )}
    </div>
  );
}