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
  receiptOutline,
  personOutline,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
  flameOutline,
  pricetagOutline,
  bicycleOutline,
  snowOutline,
  bagHandleOutline,
  nutritionOutline,
  waterOutline,
  cubeOutline,
  sparklesOutline,
  basketOutline,
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

  const [currentOffer, setCurrentOffer] = useState(0);

  const categoriesRef = useRef<HTMLDivElement>(null);

  const categoryDragMoved = useRef(false);

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

  const offers = [
    {
      title: 'Oferta especial',
      subtitle: 'Aprovecha nuestros mejores precios',
      description:
        'Productos seleccionados por tiempo limitado.',
      icon: flameOutline,
    },
    {
      title: 'Combos especiales',
      subtitle: 'Lleva más y paga menos',
      description:
        'Descubre nuestros combos disponibles para ti.',
      icon: pricetagOutline,
    },
    {
      title: 'Delivery rápido',
      subtitle: 'Tu compra hasta tu puerta',
      description:
        'Haz tu pedido y recíbelo donde estés.',
      icon: bicycleOutline,
    },
  ];

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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentOffer((previousOffer) =>
        previousOffer === offers.length - 1
          ? 0
          : previousOffer + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [offers.length]);

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = normalizeText(categoryName);

    if (
      name.includes('fria') ||
      name.includes('bebida')
    ) {
      return snowOutline;
    }

    if (
      name.includes('viver') ||
      name.includes('abarrote')
    ) {
      return bagHandleOutline;
    }

    if (
      name.includes('provision') ||
      name.includes('alimento')
    ) {
      return nutritionOutline;
    }

    if (
      name.includes('lacteo') ||
      name.includes('leche')
    ) {
      return waterOutline;
    }

    if (
      name.includes('enlat') ||
      name.includes('lata')
    ) {
      return cubeOutline;
    }

    if (
      name.includes('limpieza') ||
      name.includes('higiene')
    ) {
      return sparklesOutline;
    }

    return basketOutline;
  };

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = normalizeText(searchTerm);

    const categoryName =
      product.category?.name ?? '';

    const productText = normalizeText(
      `${product.name} ${product.description ?? ''} ${categoryName}`
    );

    const matchesSearch =
      normalizedSearch === '' ||
      productText.includes(normalizedSearch);

    const matchesCategory =
      searchTerm.trim() !== ''
        ? true
        : selectedCategory === null ||
          product.category?.id === selectedCategory;

    return matchesCategory && matchesSearch;
  });

  const handleProfile = () => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      history.push('/perfil');
    } else {
      history.push('/login');
    }
  };

  const handleSearch = () => {
    const input =
      document.querySelector<HTMLInputElement>(
        '.search-box input'
      );

    const searchBox =
      document.querySelector('.search-box');

    searchBox?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    window.setTimeout(() => {
      input?.focus();
    }, 350);
  };

  const goToProducts = () => {
    document
      .querySelector('.products-section')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const handleCategoriesMouseDown = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (!categoriesRef.current) {
      return;
    }

    setIsDraggingCategories(true);

    categoryDragMoved.current = false;

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

    const currentX =
      event.pageX -
      categoriesRef.current.offsetLeft;

    const distance =
      currentX - dragStartX;

    if (Math.abs(distance) > 5) {
      categoryDragMoved.current = true;
    }

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

                  <span>
                    Entrega en tu ubicación
                  </span>

                </div>

              </div>

            </div>

            <div className="header-actions">

              <button
                className="cart-button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Abrir carrito"
              >
                <IonIcon icon={cartOutline} />

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
                <IonIcon icon={personOutline} />
              </button>

            </div>

          </header>

          <div className="search-box">

            <IonIcon icon={searchOutline} />

            <input
              type="text"
              placeholder="¿Qué necesitas hoy?"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}

          </div>

          <section className="offers-section">

            <div className="offers-heading">

              <h2>Ofertas de hoy</h2>

              <span>
                Especiales para ti
              </span>

            </div>

            <div className="offer-card">

              <div className="offer-content">

                <div className="offer-label">

                  <IonIcon
                    icon={offers[currentOffer].icon}
                  />

                  <span>
                    {offers[currentOffer].title}
                  </span>

                </div>

                <h2>
                  {offers[currentOffer].subtitle}
                </h2>

                <p>
                  {offers[currentOffer].description}
                </p>

                <button
                  className="offer-button"
                  onClick={goToProducts}
                >
                  Ver ofertas

                  <IonIcon
                    icon={chevronForwardOutline}
                  />
                </button>

              </div>

              <div className="offer-icon">

                <IonIcon
                  icon={offers[currentOffer].icon}
                />

              </div>

              <div className="offer-dots">

                {offers.map((_, index) => (

                  <button
                    type="button"
                    key={index}
                    className={
                      index === currentOffer
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      setCurrentOffer(index)
                    }
                    aria-label={`Oferta ${index + 1}`}
                  />

                ))}

              </div>

            </div>

          </section>

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
                onClick={() => {
                  if (categoryDragMoved.current) {
                    return;
                  }

                  setSelectedCategory(null);
                }}
              >

                <div className="category-icon">
                  <IonIcon icon={basketOutline} />
                </div>

                <span>Todos</span>

              </button>

              {categories.map((category) => (

                <button
                  key={category.id}
                  className={`category-card ${
                    selectedCategory === category.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    if (categoryDragMoved.current) {
                      return;
                    }

                    setSelectedCategory(category.id);
                  }}
                >

                  <div className="category-icon">

                    <IonIcon
                      icon={getCategoryIcon(category.name)}
                    />

                  </div>

                  <span>
                    {category.name}
                  </span>

                </button>

              ))}

            </div>

          </section>

          <section className="section products-section">

            <div className="section-header">

              <h2>
                {searchTerm
                  ? `Resultados para "${searchTerm}"`
                  : selectedCategory === null
                    ? 'Populares 🔥'
                    : 'Productos'}
              </h2>

              {(selectedCategory !== null ||
                searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchTerm('');
                  }}
                >
                  Ver todos

                  <IonIcon
                    icon={chevronForwardOutline}
                  />
                </button>
              )}

            </div>

            {searchTerm && (
              <p className="search-results-count">
                {filteredProducts.length}{' '}
                resultado
                {filteredProducts.length !== 1
                  ? 's'
                  : ''}
              </p>
            )}

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

                filteredProducts.map((product) => (

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

                ))

              )}

            </div>

          </section>

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
                    <IonIcon icon={logoFacebook} />
                  </a>

                  <a
                    href="#"
                    aria-label="Instagram"
                  >
                    <IonIcon icon={logoInstagram} />
                  </a>

                  <a
                    href="#"
                    aria-label="WhatsApp"
                  >
                    <IonIcon icon={logoWhatsapp} />
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

          <nav className="bottom-navigation">

            <button
              className="active"
              onClick={() => history.push('/')}
            >
              <IonIcon icon={homeOutline} />
              <small>Inicio</small>
            </button>

            <button
              onClick={handleSearch}
            >
              <IonIcon icon={searchOutline} />
              <small>Buscar</small>
            </button>

            <button
              onClick={() =>
                history.push('/pedidos')
              }
            >
              <IonIcon icon={receiptOutline} />
              <small>Pedidos</small>
            </button>

            <button
              onClick={handleProfile}
            >
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