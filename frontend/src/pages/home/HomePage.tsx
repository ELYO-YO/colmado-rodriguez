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
  searchOutline,
  chevronForwardOutline,
  homeOutline,
  receiptOutline,
  personOutline,
  logoFacebook,
  logoInstagram,
  logoWhatsapp,
  snowOutline,
  bagHandleOutline,
  nutritionOutline,
  waterOutline,
  cubeOutline,
  sparklesOutline,
  basketOutline,
  storefrontOutline,
  bicycleOutline,
  cartSharp,
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

import {
  getProducts,
} from '../../services/productService';

import './HomePage.css';


/* =========================================
   SLIDES DEL BANNER
========================================= */

const heroSlides = [
  {
    id: 1,
    label: 'COLMADO RODRÍGUEZ',
    title: 'Todo lo que necesitas, más cerca de ti.',
    description:
      'Encuentra tus productos favoritos de forma rápida y sencilla.',
    button: 'Comprar ahora',
    icon: cartSharp,
  },

  {
    id: 2,
    label: 'DELIVERY',
    title: 'Tu pedido directo hasta tu puerta.',
    description:
      'Haz tu compra desde casa y nosotros nos encargamos del resto.',
    button: 'Hacer pedido',
    icon: bicycleOutline,
  },

  {
    id: 3,
    label: 'TU COLMADO',
    title: 'Siempre cerca de ti.',
    description:
      'Compra fácil, rápido y con la confianza de Colmado Rodríguez.',
    button: 'Ver productos',
    icon: storefrontOutline,
  },
];


function HomePage() {
  const history = useHistory();

  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [currentHero, setCurrentHero] =
    useState(0);

  const categoriesRef =
    useRef<HTMLDivElement>(null);

  const categoryDragMoved =
    useRef(false);

  const [isDraggingCategories, setIsDraggingCategories] =
    useState(false);

  const [dragStartX, setDragStartX] =
    useState(0);

  const [dragScrollLeft, setDragScrollLeft] =
    useState(0);

  const {
    cartItems,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  /* =========================================
     CARGAR CATEGORÍAS
  ========================================= */

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


  /* =========================================
     CARGAR PRODUCTOS
  ========================================= */

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


  /* =========================================
     CARRUSEL DEL BANNER
  ========================================= */

  useEffect(() => {
    const interval =
      window.setInterval(() => {

        setCurrentHero(
          (current) =>
            current ===
            heroSlides.length - 1
              ? 0
              : current + 1
        );

      }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);


  /* =========================================
     OFERTAS DE DJANGO
  ========================================= */

  const offerProducts =
    products.filter(
      (product) =>
        product.is_offer
    );


  /* =========================================
     NORMALIZAR TEXTO
  ========================================= */

  const normalizeText = (
    text: string
  ) => {
    return text
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .trim();
  };


  /* =========================================
     ICONOS CATEGORÍAS
  ========================================= */

  const getCategoryIcon = (
    categoryName: string
  ) => {
    const name =
      normalizeText(
        categoryName
      );

    if (
      name.includes('fria') ||
      name.includes('bebida') ||
      name.includes('refresco')
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


  /* =========================================
     BUSCADOR
  ========================================= */

  const normalizedSearch =
    normalizeText(
      searchTerm
    );

  const filteredProducts =
    products.filter(
      (product) => {

        const productName =
          normalizeText(
            product.name ?? ''
          );

        const description =
          normalizeText(
            product.description ?? ''
          );

        const categoryName =
          normalizeText(
            product.category?.name ?? ''
          );

        return (
          normalizedSearch === '' ||
          productName.includes(
            normalizedSearch
          ) ||
          description.includes(
            normalizedSearch
          ) ||
          categoryName.includes(
            normalizedSearch
          )
        );
      }
    );


  const handleSearchChange = (
    value: string
  ) => {
    setSearchTerm(value);

    if (
      value.trim() !== ''
    ) {
      setSelectedCategory(null);
    }
  };


  /* =========================================
     FILTRO CATEGORÍA
  ========================================= */

  const categoryProducts =
    products.filter(
      (product) => {

        if (
          selectedCategory === null
        ) {
          return true;
        }

        return (
          product.category?.id ===
          selectedCategory
        );
      }
    );


  /* =========================================
     PERFIL
  ========================================= */

  const handleProfile = () => {
    const token =
      localStorage.getItem(
        'accessToken'
      );

    if (token) {
      history.push('/perfil');
    } else {
      history.push('/login');
    }
  };


  /* =========================================
     SEARCH MOBILE
  ========================================= */

  const handleSearch = () => {
    const input =
      document.querySelector<HTMLInputElement>(
        '.search-box input'
      );

    const searchBox =
      document.querySelector(
        '.search-box'
      );

    searchBox?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    window.setTimeout(() => {
      input?.focus();
    }, 350);
  };


  /* =========================================
     CATEGORÍA
  ========================================= */

  const handleCategorySelect = (
    categoryId: number | null
  ) => {

    if (
      categoryDragMoved.current
    ) {
      return;
    }

    setSelectedCategory(
      categoryId
    );

    setSearchTerm('');
  };


  /* =========================================
     DRAG DE CATEGORÍAS
  ========================================= */

  const handleCategoriesMouseDown = (
    event: MouseEvent<HTMLDivElement>
  ) => {

    if (
      !categoriesRef.current
    ) {
      return;
    }

    setIsDraggingCategories(
      true
    );

    categoryDragMoved.current =
      false;

    setDragStartX(
      event.pageX -
      categoriesRef.current.offsetLeft
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
      currentX -
      dragStartX;

    if (
      Math.abs(distance) > 5
    ) {
      categoryDragMoved.current =
        true;
    }

    categoriesRef.current.scrollLeft =
      dragScrollLeft -
      distance;
  };


  const stopCategoriesDrag =
    () => {

      setIsDraggingCategories(
        false
      );

      window.setTimeout(() => {
        categoryDragMoved.current =
          false;
      }, 50);
    };


  const hero =
    heroSlides[currentHero];


  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="home-container">


          {/* =================================
              HEADER
          ================================= */}

          <header className="home-header">

            <div className="brand">

              <img
                className="brand-logo"
                src="/images/logo/logo-colmado-rodriguez.png"
                alt="Colmado Rodríguez"
              />

              <div className="brand-info">

                <span className="welcome-text">
  ¿Qué necesitas hoy?
</span>

<div className="location">
  <IonIcon icon={basketOutline} />

  <span>
    Encuentra de todo para tu hogar
  </span>
</div>

              </div>

            </div>


            <div className="header-actions">

              <button
                type="button"
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
                type="button"
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


          {/* =================================
              SEARCH
          ================================= */}

          <div className="search-box">

            <IonIcon
              icon={searchOutline}
            />

            <input
              type="search"
              placeholder="Buscar arroz, leche, refrescos..."
              value={searchTerm}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value
                )
              }
              autoComplete="off"
            />

            {searchTerm && (

              <button
                type="button"
                className="search-clear"
                onClick={() =>
                  setSearchTerm('')
                }
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>

            )}

          </div>


          {/* =================================
              RESULTADOS DEL SEARCH
          ================================= */}

          {searchTerm.trim() !== '' && (

            <div className="search-dropdown">

              <div className="search-dropdown-header">

                <span>
                  Resultados
                </span>

                <small>
                  {filteredProducts.length}
                </small>

              </div>


              {filteredProducts.length === 0 ? (

                <div className="search-dropdown-empty">

                  No encontramos productos para
                  {' "'}
                  {searchTerm}
                  {'"'}

                </div>

              ) : (

                <div className="search-dropdown-list">

                  {filteredProducts
                    .slice(0, 6)
                    .map((product) => (

                      <button
                        type="button"
                        className="search-product-item"
                        key={product.id}
                        onClick={() =>
                          history.push(
                            `/producto/${product.id}`
                          )
                        }
                      >

                        <div className="search-product-image">

                          <img
                            src={product.image}
                            alt={product.name}
                          />

                        </div>

                        <div className="search-product-info">

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.description}
                          </span>

                          <b>
                            RD${' '}
                            {Number(
                              product.price
                            ).toLocaleString(
                              'es-DO'
                            )}
                          </b>

                        </div>

                      </button>

                    ))}

                </div>

              )}

            </div>

          )}


          {/* =================================
              HERO / BANNER
          ================================= */}

          <section className="hero-section">

            <div
              className={
                `hero-card hero-slide-${hero.id}`
              }
            >

              <div className="hero-content">

                <span className="hero-label">
                  {hero.label}
                </span>

                <h1>
                  {hero.title}
                </h1>

                <p>
                  {hero.description}
                </p>

                <button
                  type="button"
                  className="hero-button"
                  onClick={() => {

                    document
                      .querySelector(
                        '.products-section'
                      )
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      });

                  }}
                >

                  {hero.button}

                  <IonIcon
                    icon={
                      chevronForwardOutline
                    }
                  />

                </button>

              </div>


              <div className="hero-icon">

                <IonIcon
                  icon={hero.icon}
                />

              </div>


              <div className="hero-dots">

                {heroSlides.map(
                  (slide, index) => (

                    <button
                      type="button"
                      key={slide.id}
                      className={
                        currentHero === index
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        setCurrentHero(index)
                      }
                      aria-label={
                        `Banner ${index + 1}`
                      }
                    />

                  )
                )}

              </div>

            </div>

          </section>


          {/* =================================
              OFERTAS
          ================================= */}

          {offerProducts.length > 0 && (

            <section className="offers-section">

              <div className="section-header">

                <div>

                  <h2>
                    Ofertas de hoy 🔥
                  </h2>

                  <span className="section-subtitle">
                    Aprovecha antes de que se acaben
                  </span>

                </div>

              </div>


              <div className="offers-products">

                {offerProducts.map(
                  (product) => (

                    <article
                      className="offer-product-card"
                      key={product.id}
                      onClick={() =>
                        history.push(
                          `/producto/${product.id}`
                        )
                      }
                    >

                      <div className="offer-product-picture">

  {(product.discount_percentage ?? 0) > 0 && (
    <span className="offer-discount">
      -{product.discount_percentage ?? 0}%
    </span>
  )}

  <img
    src={product.image}
    alt={product.name}
  />

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
                              RD${' '}
                              {Number(
                                product.old_price
                              ).toLocaleString(
                                'es-DO'
                              )}
                            </span>

                          )}

                          <strong>
                            RD${' '}
                            {Number(
                              product.price
                            ).toLocaleString(
                              'es-DO'
                            )}
                          </strong>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            </section>

          )}


          {/* =================================
              CATEGORÍAS
          ================================= */}

          <section className="section">

            <div className="section-header">

              <h2>
                Categorías
              </h2>

            </div>


            <div
              ref={categoriesRef}
              className={
                `categories ${
                  isDraggingCategories
                    ? 'dragging'
                    : ''
                }`
              }
              onMouseDown={
                handleCategoriesMouseDown
              }
              onMouseMove={
                handleCategoriesMouseMove
              }
              onMouseUp={
                stopCategoriesDrag
              }
              onMouseLeave={
                stopCategoriesDrag
              }
            >

              <button
                type="button"
                className={
                  `category-card ${
                    selectedCategory === null
                      ? 'selected'
                      : ''
                  }`
                }
                onClick={() =>
                  handleCategorySelect(null)
                }
              >

                <div className="category-icon">

                  <IonIcon
                    icon={basketOutline}
                  />

                </div>

                <span>
                  Todos
                </span>

              </button>


              {categories.map(
                (category) => (

                  <button
                    type="button"
                    key={category.id}
                    className={
                      `category-card ${
                        selectedCategory ===
                        category.id
                          ? 'selected'
                          : ''
                      }`
                    }
                    onClick={() =>
                      handleCategorySelect(
                        category.id
                      )
                    }
                  >

                    <div className="category-icon">

                      <IonIcon
                        icon={
                          getCategoryIcon(
                            category.name
                          )
                        }
                      />

                    </div>

                    <span>
                      {category.name}
                    </span>

                  </button>

                )
              )}

            </div>

          </section>


          {/* =================================
              PRODUCTOS
          ================================= */}

          <section
            className="section products-section"
          >

            <div className="section-header">

              <h2>

                {selectedCategory === null
                  ? 'Productos'
                  : categories.find(
                      (category) =>
                        category.id ===
                        selectedCategory
                    )?.name ??
                    'Productos'}

              </h2>


              {selectedCategory !== null && (

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(null)
                  }
                >

                  Ver todos

                  <IonIcon
                    icon={
                      chevronForwardOutline
                    }
                  />

                </button>

              )}

            </div>


            <div className="products-grid">

              {loadingProducts ? (

                <p className="products-message">
                  Cargando productos...
                </p>

              ) : categoryProducts.length ===
                0 ? (

                <p className="products-message">
                  No hay productos disponibles.
                </p>

              ) : (

                categoryProducts.map(
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


          {/* =================================
              FOOTER
          ================================= */}

          <footer className="home-footer">

            <div className="footer-content">

              <div className="footer-social">

                <h3>
                  Síguenos
                </h3>

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
                ©{' '}
                {new Date().getFullYear()}{' '}
                Colmado Rodríguez.
                Todos los derechos reservados.
              </span>

            </div>

          </footer>


          {/* =================================
              CARRITO
          ================================= */}

          {isCartOpen && (

            <Cart
              items={cartItems}
              onClose={() =>
                setIsCartOpen(false)
              }
              onIncrease={
                increaseQuantity
              }
              onDecrease={
                decreaseQuantity
              }
              onRemove={
                removeFromCart
              }
            />

          )}


          {/* =================================
              NAVEGACIÓN MOBILE
          ================================= */}

          <nav className="bottom-navigation">

            <button
              type="button"
              className="active"
              onClick={() =>
                history.push('/')
              }
            >

              <IonIcon
                icon={homeOutline}
              />

              <small>
                Inicio
              </small>

            </button>


            <button
              type="button"
              onClick={handleSearch}
            >

              <IonIcon
                icon={searchOutline}
              />

              <small>
                Buscar
              </small>

            </button>


            <button
              type="button"
              onClick={() =>
                history.push('/pedidos')
              }
            >

              <IonIcon
                icon={receiptOutline}
              />

              <small>
                Pedidos
              </small>

            </button>


            <button
              type="button"
              onClick={handleProfile}
            >

              <IonIcon
                icon={personOutline}
              />

              <small>
                Perfil
              </small>

            </button>

          </nav>

        </div>

      </IonContent>

    </IonPage>
  );
}


export default HomePage;