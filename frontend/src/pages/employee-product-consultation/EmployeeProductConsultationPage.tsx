import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  searchOutline,
  storefrontOutline,
  pricetagOutline,
} from 'ionicons/icons';

import {
  getAdminProducts,
  getCategories,
  type AdminProduct,
  type Category,
} from '../../services/productAdminService';

import {
  getProfile,
} from '../../services/authService';

import './EmployeeProductConsultationPage.css';

function EmployeeProductConsultationPage() {
  const history = useHistory();

  const [products, setProducts] =
    useState<AdminProduct[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const profile = await getProfile();

        if (
          profile.role !== 'employee' &&
          profile.role !== 'admin'
        ) {
          history.replace('/');
          return;
        }

        const [
          productData,
          categoryData,
        ] = await Promise.all([
          getAdminProducts(),
          getCategories(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error(
          'Error cargando productos:',
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los productos.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [history]);

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredProducts =
    products.filter((product) => {
      const matchesSearch =
        normalizedSearch === '' ||
        product.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === 'all' ||
        String(product.category?.id) ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="employee-products-page">

          <header className="employee-products-header">
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                history.push('/dashboard');
              }}
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <div>
              <span>
                Panel empleado
              </span>

              <h1>
                Consulta de productos
              </h1>

              <p>
                Busca productos,
                precios y disponibilidad.
              </p>
            </div>
          </header>

          <section className="employee-products-tools">

            <div className="employee-products-search">
              <IonIcon
                icon={searchOutline}
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Buscar producto..."
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchTerm('')
                  }
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(
                  event.target.value
                )
              }
            >
              <option value="all">
                Todas las categorías
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

          </section>

          {error && (
            <div className="employee-products-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="employee-products-message">
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="employee-products-empty">
              <IonIcon
                icon={storefrontOutline}
              />

              <h2>
                No encontramos productos
              </h2>

              <p>
                Prueba con otra búsqueda
                o categoría.
              </p>
            </div>
          ) : (
            <>
              <div className="employee-products-count">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'producto encontrado'
                  : 'productos encontrados'}
              </div>

              <div className="employee-products-grid">

                {filteredProducts.map(
                  (product) => (
                    <article
                      className="employee-product-card"
                      key={product.id}
                    >

                      <div className="employee-product-image">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <IonIcon
                            icon={
                              storefrontOutline
                            }
                          />
                        )}

                        {product.is_offer && (
                          <span className="employee-offer-badge">
                            <IonIcon
                              icon={
                                pricetagOutline
                              }
                            />

                            {product.discount_percentage}% OFF
                          </span>
                        )}

                      </div>

                      <div className="employee-product-body">

                        <div className="employee-product-top">

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.category?.name ??
                                'Sin categoría'}
                            </span>
                          </div>

                          <span
                            className={
                              product.available
                                ? 'employee-product-status available'
                                : 'employee-product-status unavailable'
                            }
                          >
                            {product.available
                              ? 'Disponible'
                              : 'No disponible'}
                          </span>

                        </div>

                        <p>
                          {product.description}
                        </p>

                        <div className="employee-product-price">

                          {product.is_offer &&
                            product.old_price && (
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
            </>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default EmployeeProductConsultationPage;