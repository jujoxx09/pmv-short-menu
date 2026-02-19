import React, { useRef, useEffect, useState } from "react";
import Video from "./components/Video";
import Home from "./components/Home";

import videoIcon from "./assets/video.png";
import menuIcon from "./assets/menu.png";
import listaIcon from "./assets/lista.png";
import favoritosIcon from "./assets/favoritos.png";

const videos = [
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Bruschetta",
    price: "8€",
    category: "Entrantes",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa BBQ",
    price: "14€",
    category: "Hamburguesas",
  },
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Cheesecake",
    price: "6€",
    category: "Postres",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Hamburguesas",
  },
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Vegano",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Vegano",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Vegano",
  },
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Cocktails",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "Especiales",
  },
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "rgrgr",
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa Doble",
    price: "16€",
    category: "rgdg",
  },
];



function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showVideos, setShowVideos] = useState(false); // controla si se muestra la página de videos
  const [activeTab, setActiveTab] = useState("Videos");
  const videoRefs = useRef([]);
  const categories = ["Todos", ...new Set(videos.map(v => v.category))];
  const menuVideoRefs = useRef([]);

  const filteredVideos =
    selectedCategory === "Todos"
    ? videos
    : videos.filter(video => video.category === selectedCategory);

  const goToCarta = () => {
    setShowVideos(true);
  };

  useEffect(() => {
  const setRealHeight = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };

  setRealHeight();
  window.addEventListener("resize", setRealHeight);

  return () => window.removeEventListener("resize", setRealHeight);
  }, []);
  

  useEffect(() => {
    setActiveIndex(0);
    //videoRefs.current = [];
  }, [selectedCategory]);

  useEffect(() => {

    if (!showVideos) return; 
    
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6, // video al 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      });
    }, options);

    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    if (videoRefs.current[0]) {
      const videoEl = videoRefs.current[0].querySelector("video");
    
      if (videoEl) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
      }
    }

    return () => observer.disconnect();
  }, [showVideos, filteredVideos]);

  if (!showVideos) {
    return <Home onGoToCarta={goToCarta} />;
  }


  return (
    <div className="page">
      <div className="app-container">

        <header className="header">
          <h1>Mi Carta Digital</h1>
        </header>

        <div
  className="category-bar"
  onMouseMove={(e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // posición X relativa
    const percent = mouseX / rect.width;   // 0 = izquierda, 1 = derecha
    const maxScroll = bar.scrollWidth - bar.clientWidth;
    bar.scrollLeft = percent * maxScroll;
  }}
>
  {categories.map((cat, index) => (
    <button
      key={index}
      className={selectedCategory === cat ? "active-category" : ""}
      onClick={() => setSelectedCategory(cat)}
    >
      {cat}
    </button>
  ))}
</div>

        <div className="phone-wrapper">
          <div className="phone-container">
            {activeTab === "Videos" ? (
              <div className="app">
                {filteredVideos.map((video, index) => (
                  <Video
                    key={index}
                    url={video.url}
                    title={video.title}
                    price={video.price}
                    isActive={index === activeIndex}
                    index={index}
                    ref={(el) => (videoRefs.current[index] = el)}
                  />
                ))}
              </div>
            ) : activeTab === "Menu" ? (
             <div className="menu-vertical">
                {filteredVideos.map((video, index) => (
                  <div key={index} className="menu-card-vertical">
                    <video
                      ref={(el) => (menuVideoRefs.current[index] = el)}
                      src={video.url}
                      muted
                      loop
                      playsInline
                      className="menu-video-vertical"
                      onClick={() => {
                        // Pausar todos los videos
                        menuVideoRefs.current.forEach((vid, i) => {
                          if (vid && i !== index) {
                            vid.pause();
                            vid.currentTime = 0;
                          }
                        });

                        // Reproducir el seleccionado
                        const currentVideo = menuVideoRefs.current[index];
                        if (currentVideo.paused) {
                          currentVideo.play();
                        } else {
                          currentVideo.pause();
                        }
                      }}
                    />
                    <div className="menu-info">
                      <h3>{video.title}</h3>
                      <p className="menu-description">{video.description}</p>
                      <p className="menu-price">{video.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

      

        <div className="bottom-nav">
          <button onClick={() => setActiveTab("Videos")} >
            <img src={videoIcon} alt="Videos" className="nav-icon" />
            <p>Videos</p>
          </button>

          <button onClick={() => setActiveTab("Menu")}>
            <img src={menuIcon} alt="Menú" className="nav-icon" />
            <p>Menú</p>
          </button>

          <button>
            <img src={listaIcon} alt="Mi Lista" className="nav-icon" />
            <p>Mi Lista</p>
          </button>

          <button>
            <img src={favoritosIcon} alt="Favoritos" className="nav-icon" />
            <p>Favoritos</p>
          </button>
        </div>
      </div>
    </div>
  );

}

export default App;


