import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';

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
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
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

  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);

  const [isDraggingCategories, setIsDraggingCategories] =
    useState(false);

  const [dragStartX, setDragStartX] = useState(0);

  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const {
    cartItems,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // Cargar categorías
  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(
          'Error cargando categorías:',
          error
        );
      });
  }, []);

  // Cargar productos
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(
          'Error cargando productos:',
          error
        );
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === null ||
      product.category?.id === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Perfil
  const handleProfile = () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      history.push('/perfil');
    } else {
      history.push('/login');
    }
  };

  // Buscador
  const handleSearch = () => {
    document
      .querySelector<HTMLInputElement>(
        '.search-box input'
      )
      ?.focus();
  };

  // Ir a productos
  const goToProducts = () => {
    document
      .querySelector('.products-section')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  // Arrastrar categorías con mouse
  const handleCategoriesMouseDown = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (!categoriesRef.current) {
      return;
    }

    setIsDraggingCategories(true);

    setDragStartX(
      event.pageX - categoriesRef.current.offsetLeft
    );

    setDragScrollLeft(
      categoriesRef.current.scrollLeft
    );
  };

  const handleCategoriesMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      !isDraggingCategories ||
      !categoriesRef.current
    ) {
      return;
    }

    event.preventDefault();

    const currentX =
      event.pageX -
      categoriesRef.current.offsetLeft;

    const distance =
      currentX - dragStartX;

    categoriesRef.current.scrollLeft =
      dragScrollLeft - distance;
  };

  const stopCategoriesDrag = () => {
    setIsDraggingCategories(false);
  };

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

                  <IonIcon
                    icon={locationOutline}
                  />

                  <span>
                    Entrega en tu ubicación
                  </span>

                </div>

              </div>

            </div>

            <div className="header-actions">

              <button
                className="cart-button"
                onClick={() =>
                  setIsCartOpen(true)
                }
                aria-label="Abrir carrito"
              >

                <IonIcon
                  icon={cartOutline}
                />

                {cartCount > 0 && (
                  <span className="cart-count">
                    {cartCount}
                  </span>
                )}

              </button>

              <button
                className="profile-icon-button"
                onClick={handleProfile}
                aria-label="Perfil"
              >

                <IonIcon
                  icon={personOutline}
                />

              </button>

            </div>

          </header>

          {/* Buscador */}
          <div className="search-box">

            <IonIcon icon={searchOutline} />

            <input
              type="text"
              placeholder="¿Qué necesitas hoy?"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
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

              <button
                className="hero-button"
                onClick={goToProducts}
              >

                Comprar ahora

                <IonIcon
                  icon={chevronForwardOutline}
                />

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

            <div
              ref={categoriesRef}
              className={`categories ${
                isDraggingCategories
                  ? 'dragging'
                  : ''
              }`}
              onMouseDown={handleCategoriesMouseDown}
              onMouseMove={handleCategoriesMouseMove}
              onMouseUp={stopCategoriesDrag}
              onMouseLeave={stopCategoriesDrag}
            >

              <button
                className={`category-card ${
                  selectedCategory === null
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setSelectedCategory(null)
                }
              >

                <div className="category-image">
                  <span>🛒</span>
                </div>

                <span>Todos</span>

              </button>

              {categories.map((category) => (

                <button
                  key={category.id}
                  className={`category-card ${
                    selectedCategory ===
                    category.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.id
                    )
                  }
                >

                  <div className="category-image">

                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      draggable="false"
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

              <h2>
                {selectedCategory === null
                  ? 'Populares 🔥'
                  : 'Productos'}
              </h2>

              <button
                onClick={() =>
                  setSelectedCategory(null)
                }
              >

                Ver todos

                <IonIcon
                  icon={chevronForwardOutline}
                />

              </button>

            </div>

            <div className="products-grid">

              {loadingProducts ? (

                <p className="products-message">
                  Cargando productos...
                </p>

              ) : filteredProducts.length === 0 ? (

                <p className="products-message">

                  {searchTerm
                    ? `No encontramos productos para "${searchTerm}".`
                    : 'No hay productos disponibles en esta categoría.'}

                </p>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                      onClick={() =>
                        history.push(
                          `/producto/${product.id}`
                        )
                      }
                    />

                  )
                )

              )}

            </div>

          </section>

          {/* Footer */}
          <footer className="home-footer">

            <div className="footer-content">

              <div className="footer-social">

                <h3>Síguenos</h3>

                <p>
                  Mantente conectado con
                  Colmado Rodríguez
                </p>

                <div className="social-links">

                  <a
                    href="#"
                    aria-label="Facebook"
                  >
                    <IonIcon
                      icon={logoFacebook}
                    />
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                  >
                    <IonIcon
                      icon={logoInstagram}
                    />
                  </a>

                  <a
                    href="#"
                    aria-label="WhatsApp"
                  >
                    <IonIcon
                      icon={logoWhatsapp}
                    />
                  </a>

                </div>

              </div>

            </div>

            <div className="footer-bottom">

              <span>
                © {new Date().getFullYear()}{' '}
                Colmado Rodríguez. Todos los
                derechos reservados.
              </span>

            </div>

          </footer>

          {/* Carrito */}
          {isCartOpen && (

            <Cart
              items={cartItems}
              onClose={() =>
                setIsCartOpen(false)
              }
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />

          )}

          {/* Navegación móvil */}
          <nav className="bottom-navigation">

            <button
              className="active"
              onClick={() =>
                history.push('/')
              }
            >

              <IonIcon
                icon={homeOutline}
              />

              <small>Inicio</small>

            </button>

            <button
              onClick={handleSearch}
            >

              <IonIcon
                icon={searchOutline}
              />

              <small>Buscar</small>

            </button>

            <button
              className="bottom-cart-button"
              onClick={() =>
                setIsCartOpen(true)
              }
            >

              <div className="bottom-icon-wrapper">

                <IonIcon
                  icon={bagHandleOutline}
                />

                {cartCount > 0 && (

                  <span className="bottom-cart-count">
                    {cartCount}
                  </span>

                )}

              </div>

              <small>Carrito</small>

            </button>

            <button
              onClick={() =>
                history.push('/pedidos')
              }
            >

              <IonIcon
                icon={receiptOutline}
              />

              <small>Pedidos</small>

            </button>

            <button
              onClick={handleProfile}
            >

              <IonIcon
                icon={personOutline}
              />

              <small>Perfil</small>

            </button>

          </nav>

        </div>

      </IonContent>

    </IonPage>
  );
}

export default HomePage;