import { useState } from 'react';
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
} from 'ionicons/icons';

import ProductCard, {
  type Product,
} from '../../components/ProductCard/ProductCard';

import { products } from '../../data/products';

import Cart from '../../components/Cart/Cart';

import type { CartItem } from '../../types/cart';

import './HomePage.css';

const categories = [
  {
    name: 'Frías',
    image: '/images/categories/frias.jpg',
  },
  {
    name: 'Víveres',
    image: '/images/categories/viveres.jpg',
  },
  {
    name: 'Provisiones',
    image: '/images/categories/provisiones.jpg',
  },
  {
    name: 'Lácteos',
    image: '/images/categories/lacteos.jpg',
  },
  {
    name: 'Enlatados',
    image: '/images/categories/enlatados.jpg',
  },
  {
    name: 'Limpieza',
    image: '/images/categories/limpieza.jpg',
  },
];

function HomePage() {
  const history = useHistory();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Aumentar cantidad
  const increaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Disminuir cantidad
  const decreaseQuantity = (id: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Eliminar producto
  const removeFromCart = (id: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  // Cantidad total de productos
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="home-container">

          {/* Header */}
          <header className="home-header">

            {/* Logo + información */}
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

                  <div className="category-image">

                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                    />

                  </div>

                  <span>
                    {category.name}
                  </span>

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

                <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                onClick={() => history.push(`/producto/${product.id}`)}
              />

              ))}

            </div>

          </section>

        </div>

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
            <span>🏠</span>
            <small>Inicio</small>
          </button>

          <button>
            <span>🔎</span>
            <small>Buscar</small>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
          >
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