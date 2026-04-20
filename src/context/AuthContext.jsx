import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 escuchar usuario en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔥 leer datos de Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: data.role || "user"
            });
          } else {
            // ⚠️ fallback si no existe en Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user"
            });
          }
        } catch (error) {
          console.error("Error obteniendo usuario:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🚪 logout
  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}