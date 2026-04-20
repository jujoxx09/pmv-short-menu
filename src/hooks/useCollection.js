import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

export function useCollection(collectionName, category = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let q = query(collection(db, collectionName), orderBy("createdAt", "desc"));

        if (category && category !== "todas") {
          q = query(
            collection(db, collectionName),
            where("category", "==", category.toLowerCase().trim()),
            orderBy("createdAt", "desc")
          );
        }

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setItems(data);
      } catch (error) {
        console.error("Error:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, category]);

  return { items, loading };
}