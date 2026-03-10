import React, { useRef, useEffect, useState } from "react";
import { auth } from "./firebase";
import Login from "./components/Login";
import { onAuthStateChanged } from "firebase/auth";
import Register from "./components/Register";
import prueba from "./assets/videos/prueba.mp4";
import Video from "./components/Video";
import Home from "./components/Home";
import Modal from "./components/Modal";
import Lista from "./components/Lista";

import videoIcon from "./assets/video.png";
import menuIcon from "./assets/menu.png";
import listaIcon from "./assets/lista.png";
import favoritosIcon from "./assets/favoritos.png";

const videos = [
  {
    id: 1,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Bruschetta",
    price: 8,
    description: "Pan tostado con tomate fresco y albahaca",
    allergens: "Gluten",
    category: "Entrantes",
  },
  {
    id: 2,
    url: prueba,
    title: "Hamburguesa BBQ",
    price: 14,
    description: "Carne 100% vacuno con salsa BBQ",
    allergens: "Gluten, Lactosa",
    category: "Hamburguesas",
  },
  {
    id: 3,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Bruschetta",
    price: 8,
    description: "Pan tostado con tomate fresco y albahaca",
    allergens: "Gluten",
    category: "Hamburguesas",
  },
  {
    id: 4,
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa BBQ",
    price: 14,
    description: "Carne 100% vacuno con salsa BBQ",
    allergens: "Gluten, Lactosa",
    category: "Postres",
  },
  {
    id: 5,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Bruschetta",
    price: 8,
    description: "Pan tostado con tomate fresco y albahaca",
    allergens: "Gluten",
    category: "Postres",
  },
  {
    id: 6,
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa BBQ",
    price: 14,
    description: "Carne 100% vacuno con salsa BBQ",
    allergens: "Gluten, Lactosa",
    category: "Postres",
  },
  {
    id: 7,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Bruschetta",
    price: 8,
    description: "Pan tostado con tomate fresco y albahaca",
    allergens: "Gluten",
    category: "Ensalada",
  },
  {
    id: 8,
    url: "https://www.w3schools.com/html/movie.mp4",
    title: "Hamburguesa BBQ",
    price: 14,
    description: "Carne 100% vacuno con salsa BBQ",
    allergens: "Gluten, Lactosa",
    category: "Cocteles",
  },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showVideos, setShowVideos] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [openMenu, setOpenMenu] = useState(false);
  
  const [user, setUser] = useState(null);
  //const [cart, setCart] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedDish, setSelectedDish] = useState(null);

  const videoRefs = useRef([]);
  const categories = ["Todos", ...new Set(videos.map(v => v.category))];
  const menuVideoRefs = useRef([]);
  const categoryBarRef = useRef(null);

  const filteredVideos =
    selectedCategory === "Todos"
      ? videos
      : videos.filter(video => video.category === selectedCategory);

  const goToCarta = () => setShowVideos(true);

  // 🔥 Añadir plato
  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === dish.id);
      if (existing) {
        return prev.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1, note: "" }];
    });
  };

  // 🔥 Sumar
  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 🔥 Restar
  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const updateNote = (id, note) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, note }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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

  /*esto si falla hay que quitarlo*/ 
useEffect(() => {
  if (activeTab === "Videos") {
    videoRefs.current.forEach(ref => {
      const videoEl = ref?.querySelector("video");
      if (videoEl) {
        videoEl.pause();
      }
    });
    const firstVideo = videoRefs.current[0]?.querySelector("video");
    if (firstVideo) firstVideo.play().catch(() => {});
  }
}, [activeTab]);

useEffect(() => {
  if (!showVideos || activeTab !== "Videos") return;

  const options = { root: null, rootMargin: "0px", threshold: 0.6 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const index = Number(entry.target.dataset.index);
      if (entry.isIntersecting) {
        setActiveIndex(index);
        const videoEl = entry.target.querySelector("video");
        if (videoEl) {
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {});
        }
      } else {
        const videoEl = entry.target.querySelector("video");
        if (videoEl) {
          videoEl.pause();
        }
      }
    });
  }, options);

  videoRefs.current.forEach(ref => ref && observer.observe(ref));

  return () => observer.disconnect();
}, [showVideos, activeTab, filteredVideos]);


  if (!showVideos) return <Home onGoToCarta={goToCarta} />;
  if (!user) {
  return (
    <>
      <Login />
      <Register />
    </>
  );
}
  return (
    <div className="page">
      <div className="app-container">
        <header className="header">
          <h1>Mi Carta Digital</h1>

            <div className="menu-wrapper">
              <button 
                className="menu-btn"
                onClick={() => setOpenMenu(!openMenu)}
              >
                ⋮
              </button>

              {openMenu && (
                <div className="menu-dropdown">
                  <button onClick={() => setActiveTab("Lista")}>Ver Pedido</button>
                  <button onClick={() => setSelectedCategory("Todos")}>Todas las categorías</button>
                  <button onClick={() => alert("Función próximamente")}>Información</button>
                </div>
              )}
            </div>
        </header>

        {activeTab !== "Lista" && (
          <div
            ref={categoryBarRef}
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
                onClick={(e) => {
                  setSelectedCategory(cat);

                  const buttonLeft = button.offsetLeft;
                  const buttonWidth = button.offsetWidth;
                  const barWidth = bar.offsetWidth;

                  let scrollPosition =
                    buttonLeft - barWidth / 2 + buttonWidth / 2;

                  // 🔥 Limitar valores
                  const maxScroll = bar.scrollWidth - bar.clientWidth;

                  if (scrollPosition < 0) scrollPosition = 0;
                  if (scrollPosition > maxScroll) scrollPosition = maxScroll;

                  bar.scrollTo({
                    left: scrollPosition,
                    behavior: "smooth",
                  });
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}    
        <div className="phone-wrapper">
          <div className="phone-container">
            {activeTab === "Videos" && (
              <div className="app">
                {filteredVideos.map((video, index) => (
                  <Video
                    key={video.id}
                    dish={video}
                    index={index}
                    isActive={index === activeIndex}
                    ref={(el) => (videoRefs.current[index] = el)}
                    onAdd={addToCart}
                    onOpenModal={setSelectedDish}
                  />
                ))}
              </div>
            )}

            {activeTab === "Menu" && (
              <div className="menu-vertical">
                {filteredVideos.map((dish, index) => (
                  <div key={dish.id} className="menu-card-vertical">                    
                    <video
                        ref={(el) => (menuVideoRefs.current[index] = el)}
                        src={dish.url}
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
                      <div className="menu-content">

                        <div className="menu-info">
    
                          <h3>{dish.title}</h3>
                          <p className="menu-description">{dish.description}</p>
                          <p className="menu-price">{dish.price}€</p>
                        </div>
                        

                        <div className="menu-buttons">
                          <button 
                            className="btn-secondary"
                            onClick={() => setSelectedDish(dish)}
                          >
                            Ver más
                          </button>

                          <button 
                            className="btn-primary"
                            onClick={() => addToCart(dish)}
                          >
                            + Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            )}

            {activeTab === "Lista" && (
              <div className="app">
                <Lista
                  cart={cart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeItem={removeItem}
                  clearCart={clearCart}
                  updateNote={updateNote}
                  total={totalPrice}
                  onOpenModal={setSelectedDish}
              />
              </div>
            )}

          </div>
          {selectedDish && (
            <Modal dish={selectedDish} onClose={() => setSelectedDish(null)} />
          )}
        </div>

        <div className="bottom-nav">
          <button onClick={() => setActiveTab("Videos")}>
            <img src={videoIcon} alt="Videos" className="nav-icon"/>
            <p>Videos</p>
          </button>

          <button onClick={() => setActiveTab("Menu")}>
            <img src={menuIcon} alt="Menú" className="nav-icon"/>
            <p>Menú</p>
          </button>

          <button 
            onClick={() => setActiveTab("Lista")}
            className={cart.length > 0 ? "nav-active-cart" : ""}
          >
            <div className="nav-icon-wrapper">
              <img src={listaIcon} alt="Mi Lista" className="nav-icon"/>

              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            <p>Mi Lista</p>
          </button>

          <button>
            <img src={favoritosIcon} alt="Favoritos" className="nav-icon"/>
            <p>Favoritos</p>
          </button>
        </div>



      </div>
    </div>
  );
}

export default App;


