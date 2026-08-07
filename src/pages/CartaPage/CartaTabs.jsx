import './CartaTabs.css';
export default function CartaTabs({ activeTab, setActiveTab, setCategoryFilter, categoryFilter, platos }) {
  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "menu", label: "Menu" },
    { id: "lista", label: "Lista" },
    { id: "favoritos", label: "Favoritos" }
  ];


  const categories = [
    ...new Set(
      platos
        .map(plato => plato.category)
        .filter(Boolean)
    )
  ];

  return (
    <>
      {/* Tabs */}
      <div
        className={`tabs ${
          activeTab === "videos" ||  activeTab === "menu" ? "tabs-videos" : "tabs-centered"
        }`}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab.id);
              setCategoryFilter(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Categorías */}
      {(activeTab === "videos" || activeTab === "menu") && (
        <div className="categories">
          <button
            className={!categoryFilter ? "active-category" : ""}
            onClick={() => setCategoryFilter(null)}
          >
            Todas
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              className={categoryFilter === cat ? "active-category" : ""}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </>
  );
}