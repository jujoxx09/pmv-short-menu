import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function MenuPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Cartas</h1>
      {videos.map(video => (
        <div key={video.id} style={{ marginBottom: 20 }}>
          <h3>{video.title}</h3>
          <video src={video.url} controls width="300" />
          <p>{video.category}</p>
        </div>
      ))}
    </div>
  );
}