import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

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
  homeOutline,
  bagHandleOutline,
  receiptOutline,
  personOutline,
} from 'ionicons/icons';

import {
  getCategories,
  type Category,
} from '../../services/categoryService';

import ProductCard, {
  type Product,
} from '../../components/ProductCard/ProductCard';

import Cart from '../../components/Cart/Cart';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/productService';

import './HomePage.css';

function HomePage() {
  const history = useHistory();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    cartItems,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // Categorías
  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error cargando categorías:', error);
      });
  }, []);

  // Productos
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error cargando productos:', error);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // Filtrar productos por categoría
  const filteredProducts = products.filter((product) => {
  const matchesCategory =
    selectedCategory === null ||
    product.category?.id === selectedCategory;

  const matchesSearch =
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  return matchesCategory && matchesSearch;
});

  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="home-container">

          {/* Header */}
          <header className="home-header">

            <div className="brand">

              <img
                className="brand-logo"
                src="/images/logo/logo-colmado-rodriguez.png"
                alt="Colmado Rodríguez"
              />

              <div className="brand-info">

                <span className="welcome-text">
                  ¡Qué lo qué! 👋
                </span>

                <div className="location">
                  <IonIcon icon={locationOutline} />
                  <span>Entrega en tu ubicación</span>
                </div>

              </div>

            </div>

            {/* Carrito */}
            <button
              className="cart-button"
              aria-label="Abrir carrito"
              onClick={() => setIsCartOpen(true)}
            >

              <IonIcon icon={cartOutline} />

              <span>{cartCount}</span>

            </button>

          </header>

          {/* Buscador */}
          <div className="search-box">

            <IonIcon icon={searchOutline} />

            <input
  type="text"
  placeholder="¿Qué necesitas hoy?"
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>

          </div>

          {/* Banner */}
          <section className="hero-banner">

            <div className="hero-content">

              <span className="hero-label">
                DELIVERY LOCAL
              </span>

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

            <div className="hero-emoji">
              🛍️
            </div>

          </section>

          {/* Categorías */}
          <section className="section">

            <div className="section-header">

              <h2>Categorías</h2>

            </div>

            <div className="categories">

              {/* Todos */}
              <button
                className={`category-card ${
                  selectedCategory === null ? 'selected' : ''
                }`}
                onClick={() => setSelectedCategory(null)}
              >

                <div className="category-image">

                  <span>🛒</span>

                </div>

                <span>Todos</span>

              </button>

              {/* Categorías de Django */}
              {categories.map((category) => (

                <button
                  className={`category-card ${
                    selectedCategory === category.id
                      ? 'selected'
                      : ''
                  }`}
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >

                  <div className="category-image">

                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                    />

                  </div>

                  <span>{category.name}</span>

                </button>

              ))}

            </div>

          </section>

          {/* Productos */}
          <section className="section products-section">

            <div className="section-header">

              <h2>
                {selectedCategory === null
                  ? 'Populares 🔥'
                  : 'Productos'}
              </h2>

              <button
                onClick={() => setSelectedCategory(null)}
              >
                Ver todos
                <IonIcon icon={chevronForwardOutline} />
              </button>

            </div>

            <div className="products-grid">

              {loadingProducts ? (

                <p>Cargando productos...</p>

              ) : filteredProducts.length === 0 ? (

                <p>
  {searchTerm
    ? `No encontramos productos para "${searchTerm}".`
    : 'No hay productos disponibles en esta categoría.'}
</p>

              ) : (

                filteredProducts.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onClick={() =>
                      history.push(`/producto/${product.id}`)
                    }
                  />

                ))

              )}

            </div>

          </section>

          {/* Carrito */}
          {isCartOpen && (

            <Cart
              items={cartItems}
              onClose={() => setIsCartOpen(false)}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />

          )}

{/* Navegación móvil */}
<nav className="bottom-navigation">
  <button className="active">
    <IonIcon icon={homeOutline} />
    <small>Inicio</small>
  </button>

  <button>
    <IonIcon icon={searchOutline} />
    <small>Buscar</small>
  </button>

  <button
    className="bottom-cart-button"
    onClick={() => setIsCartOpen(true)}
  >
    <div className="bottom-icon-wrapper">
      <IonIcon icon={bagHandleOutline} />

      {cartCount > 0 && (
        <span className="bottom-cart-count">
          {cartCount}
        </span>
      )}
    </div>

    <small>Carrito</small>
  </button>

  <button>
    <IonIcon icon={receiptOutline} />
    <small>Pedidos</small>
  </button>

  <button>
    <IonIcon icon={personOutline} />
    <small>Perfil</small>
  </button>
</nav>

        </div>

      </IonContent>

    </IonPage>
  );
}

export default HomePage;