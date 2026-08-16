import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowUpOutline,
  basketOutline,
  bicycleOutline,
  cartOutline,
  cartSharp,
  chevronForwardOutline,
  cubeOutline,
  homeOutline,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
  nutritionOutline,
  notificationsOutline,
  personOutline,
  receiptOutline,
  searchOutline,
  snowOutline,
  sparklesOutline,
  storefrontOutline,
  waterOutline,
  bagHandleOutline,
} from 'ionicons/icons';

import { getCategories, type Category } from '../../services/categoryService';
import ProductCard, { type Product } from '../../components/ProductCard/ProductCard';
import Cart from '../../components/Cart/Cart';
import NotificationPanel from '../../components/NotificationPanel/NotificationPanel';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/productService';
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from '../../services/notificationService';

import './HomePage.css';

const heroSlides = [
  {
    id: 1,
    label: 'COLMADO RODRÍGUEZ',
    title: 'Todo lo que necesitas, más cerca de ti.',
    description: 'Encuentra tus productos favoritos de forma rápida y sencilla.',
    button: 'Comprar ahora',
    icon: cartSharp,
  },
  {
    id: 2,
    label: 'DELIVERY',
    title: 'Tu pedido directo hasta tu puerta.',
    description: 'Haz tu compra desde casa y nosotros nos encargamos del resto.',
    button: 'Hacer pedido',
    icon: bicycleOutline,
  },
  {
    id: 3,
    label: 'TU COLMADO',
    title: 'Siempre cerca de ti.',
    description: 'Compra fácil, rápido y con la confianza de Colmado Rodríguez.',
    button: 'Ver productos',
    icon: storefrontOutline,
  },
];

function HomePage() {
  const history = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryDragMoved = useRef(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDraggingCategories, setIsDraggingCategories] = useState(false);
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

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error('Error cargando categorías:', error));
  }, []);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) => console.error('Error cargando productos:', error))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setNotifications([]);
      return;
    }

    getNotifications()
      .then(setNotifications)
      .catch((error) => console.error('Error cargando notificaciones:', error));
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentHero((current) =>
        current === heroSlides.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
  const loadNotifications = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  const normalizeText = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const getCategoryIcon = (categoryName: string) => {
    const name = normalizeText(categoryName);

  

    if (
      name.includes('fria') ||
      name.includes('bebida') ||
      name.includes('refresco')
    ) {
      return snowOutline;
    }

    if (name.includes('viver') || name.includes('abarrote')) {
      return bagHandleOutline;
    }

    if (name.includes('provision') || name.includes('alimento')) {
      return nutritionOutline;
    }

    if (name.includes('lacteo') || name.includes('leche')) {
      return waterOutline;
    }

    if (name.includes('enlat') || name.includes('lata')) {
      return cubeOutline;
    }

    if (name.includes('limpieza') || name.includes('higiene')) {
      return sparklesOutline;
    }

    return basketOutline;
  };

  const normalizedSearch = normalizeText(searchTerm);

  const filteredProducts = products.filter((product) => {
    const productName = normalizeText(product.name ?? '');
    const description = normalizeText(product.description ?? '');
    const categoryName = normalizeText(product.category?.name ?? '');

    return (
      normalizedSearch === '' ||
      productName.includes(normalizedSearch) ||
      description.includes(normalizedSearch) ||
      categoryName.includes(normalizedSearch)
    );
  });

  const categoryProducts = products.filter((product) => {
    if (selectedCategory === null) return true;
    return product.category?.id === selectedCategory;
  });

  const offerProducts = products.filter((product) => product.is_offer);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) setSelectedCategory(null);
  };

  const handleProfile = () => {
    const token = localStorage.getItem('accessToken');
    history.push(token ? '/perfil' : '/login');
  };

  const handleNotifications = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      history.push('/login');
      return;
    }

    setIsNotificationOpen(true);
  };

  const handleNotificationRead = async (id: number) => {
    try {
      const updated = await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? updated : notification
        )
      );
    } catch (error) {
      console.error('Error actualizando notificación:', error);
    }
  };

  const handleSearch = () => {
    const input = document.querySelector<HTMLInputElement>('.search-box input');

    document.querySelector('.search-box')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    window.setTimeout(() => input?.focus(), 350);
  };

  const handleCategorySelect = (categoryId: number | null) => {
    if (categoryDragMoved.current) return;

    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  const handleCategoriesMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!categoriesRef.current) return;

    setIsDraggingCategories(true);
    categoryDragMoved.current = false;
    setDragStartX(event.pageX - categoriesRef.current.offsetLeft);
    setDragScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleCategoriesMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCategories || !categoriesRef.current) return;

    event.preventDefault();

    const currentX = event.pageX - categoriesRef.current.offsetLeft;
    const distance = currentX - dragStartX;

    if (Math.abs(distance) > 5) {
      categoryDragMoved.current = true;
    }

    categoriesRef.current.scrollLeft = dragScrollLeft - distance;
  };

  const stopCategoriesDrag = () => {
    setIsDraggingCategories(false);

    window.setTimeout(() => {
      categoryDragMoved.current = false;
    }, 50);
  };

  const handleScroll = async () => {
    const scrollElement = await contentRef.current?.getScrollElement();

    if (!scrollElement) return;

    setShowScrollTop(scrollElement.scrollTop > 450);
  };

  const scrollToTop = () => {
    contentRef.current?.scrollToTop(500);
  };

  const scrollToSection = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    
  };

  const hero = heroSlides[currentHero];

  return (
    <IonPage>
      <IonContent
        ref={contentRef}
        fullscreen
        scrollEvents
        onIonScroll={handleScroll}
      >
        <div className="home-container">
          <header className="home-header">
            <div className="header-main">
              <div className="brand">
                <img
                  className="brand-logo"
                  src="/images/logo/logo-colmado-rodriguez.png"
                  alt="Colmado Rodríguez"
                />
              </div>

              <div className="desktop-search">
                <IonIcon icon={searchOutline} />

                <input
                  type="search"
                  placeholder="Buscar arroz, refrescos, leche..."
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  autoComplete="off"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpiar búsqueda"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="header-actions">
                <button
  type="button"
  className="notification-button"
  onClick={handleNotifications}
  aria-label="Notificaciones"
>
  <IonIcon icon={notificationsOutline} />

  {unreadNotifications > 0 && (
    <span className="notification-count">
      {unreadNotifications > 9 ? '9+' : unreadNotifications}
    </span>
  )}
</button>

                <button
                  type="button"
                  className="profile-icon-button"
                  onClick={handleProfile}
                  aria-label="Perfil"
                >
                  <IonIcon icon={personOutline} />
                </button>

                <button
                  type="button"
                  className="cart-button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Abrir carrito"
                >
                  <IonIcon icon={cartOutline} />

                  {cartCount > 0 && (
                    <span className="cart-count">{cartCount}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="header-bottom">
              <div className="header-info">
                <strong>¿Qué necesitas hoy?</strong>
                <span>Encuentra de todo para tu hogar</span>
              </div>

              <nav className="desktop-nav">
                <button type="button" onClick={scrollToTop}>
                  Inicio
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('.offers-section')}
                >
                  Ofertas
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('.categories-section')}
                >
                  Categorías
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('.products-section')}
                >
                  Productos
                </button>

                <button
                  type="button"
                  onClick={() => history.push('/pedidos')}
                >
                  Mis pedidos
                </button>
              </nav>
            </div>
          </header>

          <div className="search-box">
            <IonIcon icon={searchOutline} />

            <input
              type="search"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              autoComplete="off"
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

          {searchTerm.trim() !== '' && (
            <div className="search-dropdown">
              <div className="search-dropdown-header">
                <span>Resultados</span>
                <small>{filteredProducts.length}</small>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="search-dropdown-empty">
                  No encontramos productos para "{searchTerm}".
                </div>
              ) : (
                <div className="search-dropdown-list">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <button
                      type="button"
                      className="search-product-item"
                      key={product.id}
                      onClick={() => history.push(`/producto/${product.id}`)}
                    >
                      <div className="search-product-image">
                        <img src={product.image} alt={product.name} />
                      </div>

                      <div className="search-product-info">
                        <strong>{product.name}</strong>
                        <span>{product.description}</span>
                        <b>RD$ {Number(product.price).toLocaleString('es-DO')}</b>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <section className="hero-section">
            <div className="hero-card">
              <div className="hero-content">
                <span className="hero-label">{hero.label}</span>
                <h1>{hero.title}</h1>
                <p>{hero.description}</p>

                <button
                  type="button"
                  className="hero-button"
                  onClick={() => scrollToSection('.products-section')}
                >
                  {hero.button}
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </div>

              <div className="hero-icon">
                <IonIcon icon={hero.icon} />
              </div>

              <div className="hero-dots">
                {heroSlides.map((slide, index) => (
                  <button
                    type="button"
                    key={slide.id}
                    className={currentHero === index ? 'active' : ''}
                    onClick={() => setCurrentHero(index)}
                    aria-label={`Banner ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {offerProducts.length > 0 && (
            <section className="offers-section">
              <div className="section-header">
                <div>
                  <h2>Ofertas de hoy 🔥</h2>
                  <span className="section-subtitle">
                    Aprovecha nuestros mejores precios
                  </span>
                </div>
              </div>

              <div className="offers-products">
                {offerProducts.map((product) => (
                  <article
                    className="offer-product-card"
                    key={product.id}
                    onClick={() => history.push(`/producto/${product.id}`)}
                  >
                    <div className="offer-product-picture">
                      {(product.discount_percentage ?? 0) > 0 && (
                        <span className="offer-discount">
                          -{product.discount_percentage ?? 0}%
                        </span>
                      )}

                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="offer-product-data">
                      <strong className="offer-product-name">
                        {product.name}
                      </strong>

                      <span className="offer-product-description">
                        {product.description}
                      </span>

                      <div className="offer-product-prices">
                        {product.old_price && (
                          <span>
                            RD$ {Number(product.old_price).toLocaleString('es-DO')}
                          </span>
                        )}

                        <strong>
                          RD$ {Number(product.price).toLocaleString('es-DO')}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="section categories-section">
            <div className="section-header">
              <h2>Categorías</h2>
            </div>

            <div
              ref={categoriesRef}
              className={`categories ${isDraggingCategories ? 'dragging' : ''}`}
              onMouseDown={handleCategoriesMouseDown}
              onMouseMove={handleCategoriesMouseMove}
              onMouseUp={stopCategoriesDrag}
              onMouseLeave={stopCategoriesDrag}
            >
              <button
                type="button"
                className={`category-card ${
                  selectedCategory === null ? 'selected' : ''
                }`}
                onClick={() => handleCategorySelect(null)}
              >
                <div className="category-icon">
                  <IonIcon icon={basketOutline} />
                </div>

                <span>Todos</span>
              </button>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card ${
                    selectedCategory === category.id ? 'selected' : ''
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="category-icon">
                    <IonIcon icon={getCategoryIcon(category.name)} />
                  </div>

                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="section products-section">
            <div className="section-header">
              <div>
                <h2>
                  {selectedCategory === null
                    ? 'Productos'
                    : categories.find(
                        (category) => category.id === selectedCategory
                      )?.name ?? 'Productos'}
                </h2>

                <span className="section-subtitle">
                  {categoryProducts.length} producto
                  {categoryProducts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {selectedCategory !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                >
                  Ver todos
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              )}
            </div>

            <div className="products-grid">
              {loadingProducts ? (
                <p className="products-message">Cargando productos...</p>
              ) : categoryProducts.length === 0 ? (
                <p className="products-message">
                  No hay productos disponibles.
                </p>
              ) : (
                categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onClick={() => history.push(`/producto/${product.id}`)}
                  />
                ))
              )}
            </div>
          </section>

          <footer className="home-footer">
            <div className="footer-content">
              <div className="footer-social">
                <h3>Síguenos</h3>
                <p>Mantente conectado con Colmado Rodríguez</p>

                <div className="social-links">
                  <a href="#" aria-label="Facebook">
                    <IonIcon icon={logoFacebook} />
                  </a>

                  <a href="#" aria-label="Instagram">
                    <IonIcon icon={logoInstagram} />
                  </a>

                  <a href="#" aria-label="WhatsApp">
                    <IonIcon icon={logoWhatsapp} />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} Colmado Rodríguez. Todos los derechos
                reservados.
              </span>
            </div>
          </footer>

          {isCartOpen && (
            <Cart
              items={cartItems}
              onClose={() => setIsCartOpen(false)}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          )}

          {isNotificationOpen && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setIsNotificationOpen(false)}
              onRead={handleNotificationRead}
            />
          )}

          {showScrollTop && (
            <button
              type="button"
              className="scroll-top-button"
              onClick={scrollToTop}
              aria-label="Volver al inicio"
            >
              <IonIcon icon={arrowUpOutline} />
            </button>
          )}

          <nav className="bottom-navigation">
            <button type="button" className="active" onClick={scrollToTop}>
              <IonIcon icon={homeOutline} />
              <small>Inicio</small>
            </button>

            <button type="button" onClick={handleSearch}>
              <IonIcon icon={searchOutline} />
              <small>Buscar</small>
            </button>

            <button
              type="button"
              onClick={() => history.push('/pedidos')}
            >
              <IonIcon icon={receiptOutline} />
              <small>Pedidos</small>
            </button>

            <button type="button" onClick={handleProfile}>
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