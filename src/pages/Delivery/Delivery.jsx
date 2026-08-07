import { useEffect, useState } from "react";
import "./Delivery.css";
import { db } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { auth } from "../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Delivery() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setPedidos([]);
        setLoading(false);
        return;
      }

      try {

        const q = query(
          collection(db, "pedidos"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // ordenar por más recientes
        data.sort((a, b) => b.createdAt - a.createdAt);

        setPedidos(data);

      } catch (error) {
        console.error("Error cargando pedidos:", error);
      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Cargando pedidos... 🍔
      </div>
    );
  }

  return (
    <div className="delivery-page">

      <h1 className="delivery-title">🍔 Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <p>No tienes pedidos todavía 😢</p>
      ) : (

        pedidos.map(p => (
          <div
            key={p.id}
            style={{
              background: "#1a1a1a",
              padding: 15,
              marginBottom: 10,
              borderRadius: 12
            }}
          >

            <p className="order-total">
              💰 Total: {p.total.toFixed(2)}€
            </p>

            <p className="order-status">
              📦 Estado:{" "}
              <span className={`status ${p.estado.replace(" ", "-")}`}>
                {p.estado}
              </span>
            </p>

            <p className="order-address">📍 {p.direccion}</p>

            {/* 🍔 ITEMS */}
            <div className="order-items">

              {p.items.map((i, idx) => (
                <div key={idx} className="order-item">

                  <p>
                    {i.quantity}x {i.name}
                  </p>

                  {i.notes && (
                    <small className="order-note">
                      📝 {i.notes}
                    </small>
                  )}

                </div>
              ))}

            </div>

          </div>
        ))

      )}

    </div>
  );
}