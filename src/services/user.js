import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

// 🔹 Crear usuario si no existe
export const createUserIfNotExists = async (user) => {
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      puntos: 0,
    });
  }
};

// ➕ sumar puntos
export const addPoints = async (userId, puntos) => {
  const ref = doc(db, "usuarios", userId);

  await updateDoc(ref, {
    puntos: increment(puntos),
  });
};