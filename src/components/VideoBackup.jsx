import React, { useRef, useState, useEffect, forwardRef } from "react";

const Video = forwardRef(({ url, title, price, isActive, index }, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isNear, setIsNear] = useState(false);
  const [likes, setLikes] = useState(0);


  // Detecta si está cerca del viewport
  //Esta funcion es para precarge el video que viene despues
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNear(true);
          }
        });
      },
      {
        root: null,
        rootMargin: "200px", // 🔥 empieza a cargar antes de verse
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);


  // Maneja reproducción según si el video está activo
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (isActive && isNear) {
    video.currentTime = 0;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    // pequeño delay para asegurar que está montado
    setTimeout(playVideo, 100);
  } else {
    video.pause();
  }
}, [isActive, isNear]);

  const likeVideo = () => setLikes(likes + 1);

  return (
    <div
      className="video-container"
      ref={(el) => {
        containerRef.current = el;
        if (ref) ref(el);
      }}
      data-index={index}
    >
      {isNear && (
        <video
          ref={videoRef}
          src={url}
          className="video"
          loop
          muted
          playsInline
        />
      )}

      <div className="video-info">
        <h2>{title}</h2>
        <p>{price}</p>
      </div>

      <div className="buttons">
        <button onClick={likeVideo}>❤️ {likes}</button>
        <button>🛒</button>
      </div>
    </div>
  );
});

export default Video;
