import "./About.css";

export default function About() {
  return (
    <div className="about">
      
      {/* HERO */}
      <section className="about-hero">
        <h1>🍔 Esto no es solo una burger</h1>
        <p>
          Es vicio, es plan con colegas, es ese “una más y ya” que nunca se cumple.
        </p>
      </section>

      {/* HISTORIA */}
      <section className="about-story">
        <h2>Nuestra historia 😎</h2>
        <p>
          Todo empezó con hambre… pero hambre de hacer las cosas bien.
          Queríamos crear el sitio donde las burgers fueran brutales,
          el ambiente chill y cada visita valiera la pena.
        </p>
        <p>
          Probamos, fallamos, volvimos a probar… hasta que dimos con la receta:
          buena carne, ingredientes top y cero tonterías.
        </p>
      </section>

      {/* FILOSOFÍA */}
      <section className="about-values">
        <h2>Lo que nos define 🔥</h2>

        <div className="values">
          <div className="value">
            <h3>🔥 Calidad real</h3>
            <p>Nada de postureo. Buen producto o nada.</p>
          </div>

          <div className="value">
            <h3>🍟 Buen rollo</h3>
            <p>Vienes a comer, pero también a pasarlo bien.</p>
          </div>

          <div className="value">
            <h3>🚀 Siempre mejorando</h3>
            <p>Nuevas burgers, nuevas ideas… nunca nos quedamos quietos.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Vale, ya sabes quiénes somos…</h2>
        <p>Ahora te toca probarlo 😏</p>

        <a href="/carta" className="btn-primary big">
          Ir a la carta 🍔
        </a>
      </section>

    </div>
  );
}