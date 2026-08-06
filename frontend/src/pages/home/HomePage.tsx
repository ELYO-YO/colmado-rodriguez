import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  cartOutline,
  locationOutline,
  searchOutline,
  chevronForwardOutline,
  addOutline,
} from 'ionicons/icons';

import './HomePage.css';

const categories = [
  { name: 'Frías', emoji: '🥤' },
  { name: 'Provisiones', emoji: '🍚' },
  { name: 'Víveres', emoji: '🍌' },
  { name: 'Lácteos', emoji: '🥛' },
  { name: 'Panadería', emoji: '🍞' },
  { name: 'Limpieza', emoji: '🧹' },
];

const products = [
  {
    name: 'Arroz Premium',
    description: 'Arroz selecto 5 lb',
    price: 250,
    image: '/images/products/arroz-premium.jpg',
  },
  {
    name: 'Coca-Cola',
    description: 'Refresco 2 litros',
    price: 125,
    image: '/images/products/coca-cola.jpg',
  },
  {
    name: 'Leche Entera',
    description: 'Leche entera 1 litro',
    price: 95,
    image: '/images/products/leche-entera.jpg',
  },
  {
    name: 'Pan de Agua',
    description: 'Pan fresco del día',
    price: 75,
    image: '/images/products/pan-de-agua.jpg',
  },
];

function HomePage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="home-container">

          {/* Header */}
<header className="home-header">
  <div className="brand">
  <img
    src="/images/logo/logo-colmado-rodriguez.png"
    alt="Colmado Rodríguez"
    className="brand-logo"
  />

  <div className="brand-info">
    <span className="welcome-text">¡Qué lo qué! 👋</span>

    <div className="location">
      <IonIcon icon={locationOutline} />
      <span>Entrega en tu ubicación</span>
    </div>
  </div>
</div>

  <button className="cart-button" aria-label="Carrito">
    <IonIcon icon={cartOutline} />
    <span>0</span>
  </button>
</header>

          {/* Buscador */}
          <div className="search-box">
            <IonIcon icon={searchOutline} />
            <input
              type="text"
              placeholder="¿Qué necesitas hoy?"
            />
          </div>

          {/* Banner */}
          <section className="hero-banner">
            <div className="hero-content">
              <span className="hero-label">DELIVERY LOCAL</span>

              <h2>
                Lo que necesitas,
                <br />
                hasta tu puerta.
              </h2>

              <p>
                Compra fácil y recibe tu pedido
                sin salir de casa.
              </p>

              <button className="hero-button">
                Comprar ahora
                <IonIcon icon={chevronForwardOutline} />
              </button>
            </div>

            <div className="hero-emoji">🛍️</div>
          </section>

          {/* Categorías */}
          <section className="section">
            <div className="section-header">
              <h2>Categorías</h2>

              <button>
                Ver todas
                <IonIcon icon={chevronForwardOutline} />
              </button>
            </div>

            <div className="categories">
              {categories.map((category) => (
                <button
                  className="category-card"
                  key={category.name}
                >
                  <div className="category-icon">
                    {category.emoji}
                  </div>

                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Productos */}
          <section className="section products-section">
            <div className="section-header">
              <h2>Populares 🔥</h2>

              <button>
                Ver todos
                <IonIcon icon={chevronForwardOutline} />
              </button>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <article
                  className="product-card"
                  key={product.name}
                >
                  <div className="product-image">
                  <img src={product.image}
                   alt={product.name}
                   loading="lazy"
                   />
                   </div>

                  <div className="product-info">
                    <span className="product-name">
                      {product.name}
                    </span>

                    <span className="product-description">
                      {product.description}
                    </span>

                    <div className="product-footer">
                      <strong>
                        RD$ {product.price.toLocaleString('es-DO')}
                      </strong>

                      <button
                        className="add-button"
                        aria-label={`Agregar ${product.name}`}
                      >
                        <IonIcon icon={addOutline} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>

        {/* Navegación móvil */}
        <nav className="bottom-navigation">
          <button className="active">
            <span>🏠</span>
            <small>Inicio</small>
          </button>

          <button>
            <span>🔎</span>
            <small>Buscar</small>
          </button>

          <button>
            <span>🛒</span>
            <small>Carrito</small>
          </button>

          <button>
            <span>📦</span>
            <small>Pedidos</small>
          </button>

          <button>
            <span>👤</span>
            <small>Perfil</small>
          </button>
        </nav>

      </IonContent>
    </IonPage>
  );
}

export default HomePage;