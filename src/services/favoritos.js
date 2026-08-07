import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

// ❌ quitar de favoritos
export const removeFromFavorites = async (user, platoId) => {
  const q = query(
    collection(db, "favoritos"),
    where("userId", "==", user.uid),
    where("platoId", "==", platoId)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(async (docItem) => {
    await deleteDoc(doc(db, "favoritos", docItem.id));
  });
};

// ❤️ Añadir a favoritos (evitando duplicados)
export const addToFavorites = async (user, plato) => {
  if (!user) throw new Error("Usuario no logueado");

  const q = query(
    collection(db, "favoritos"),
    where("userId", "==", user.uid),
    where("platoId", "==", plato.id)
  );

  const existing = await getDocs(q);

  if (!existing.empty) {
    console.log("Ya está en favoritos");
    return;
  }

  await addDoc(collection(db, "favoritos"), {
     userId: user.uid,
  platoId: plato.id,

  // 🔥 INFO COMPLETA DEL PLATO
  name: plato.name || "",
  description: plato.description || "",
  price: plato.price || 0,
  category: plato.category || "",
  allergens: plato.allergens || [],
  videoUrl: plato.videoUrl || "",
  });
};