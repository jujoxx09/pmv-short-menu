import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { addPoints } from "./user";

export const redeemCode = async (user, codigo) => {
  const ref = doc(db, "codigos", codigo);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Código inválido");
  }

  const data = snap.data();

  if (data.usado) {
    throw new Error("Código ya utilizado");
  }

  // ➕ sumar puntos
  await addPoints(user.uid, data.puntos);

  // 🔒 marcar como usado
  await updateDoc(ref, {
    usado: true,
  });
};