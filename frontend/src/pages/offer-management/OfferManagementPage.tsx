import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  pricetagOutline,
  saveOutline,
} from 'ionicons/icons';

import {
  getAdminProducts,
  updateProduct,
  type AdminProduct,
} from '../../services/productAdminService';

import {
  getProfile,
} from '../../services/authService';

import './OfferManagementPage.css';

function OfferManagementPage() {
  const history = useHistory();

  const [products, setProducts] =
    useState<AdminProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [savingId, setSavingId] =
    useState<number | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const profile = await getProfile();

        if (profile.role !== 'admin') {
          history.replace('/dashboard');
          return;
        }

        const data = await getAdminProducts();

        setProducts(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las ofertas.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [history]);

  const updateLocalProduct = (
    id: number,
    changes: Partial<AdminProduct>
  ) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              ...changes,
            }
          : product
      )
    );
  };

  const handleSave = async (
    product: AdminProduct
  ) => {
    try {
      setSavingId(product.id);
      setError('');

      const updated = await updateProduct(
        product.id,
        {
          is_offer: product.is_offer,
          discount_percentage:
            product.is_offer
              ? product.discount_percentage
              : 0,
          old_price:
            product.is_offer
              ? product.old_price
              : null,
        }
      );

      setProducts((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la oferta.'
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="offer-management-page">

          <header className="offer-management-header">
            <button
              type="button"
              onClick={() =>
                history.push('/dashboard')
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <div>
              <span>
                Administración
              </span>

              <h1>
                Gestión de ofertas
              </h1>

              <p>
                Activa y configura promociones
                para tus productos.
              </p>
            </div>
          </header>

          {loading ? (
            <div className="offer-message">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="offer-message error">
              {error}
            </div>
          ) : (
            <div className="offer-list">

              {products.map((product) => (
                <article
                  className="offer-card"
                  key={product.id}
                >

                  <div className="offer-product-info">
                    <div className="offer-icon">
                      <IonIcon
                        icon={pricetagOutline}
                      />
                    </div>

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        RD${' '}
                        {Number(
                          product.price
                        ).toLocaleString(
                          'es-DO'
                        )}
                      </span>
                    </div>
                  </div>

                  <label className="offer-switch-row">
                    <div>
                      <strong>
                        Oferta activa
                      </strong>

                      <span>
                        Mostrar este producto
                        como promoción.
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        product.is_offer
                      }
                      onChange={(event) =>
                        updateLocalProduct(
                          product.id,
                          {
                            is_offer:
                              event.target.checked,
                          }
                        )
                      }
                    />
                  </label>

                  {product.is_offer && (
                    <div className="offer-fields">

                      <label>
                        Precio anterior

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            product.old_price ??
                            ''
                          }
                          onChange={(event) =>
                            updateLocalProduct(
                              product.id,
                              {
                                old_price:
                                  event.target.value,
                              }
                            )
                          }
                        />
                      </label>

                      <label>
                        Descuento %

                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={
                            product.discount_percentage
                          }
                          onChange={(event) =>
                            updateLocalProduct(
                              product.id,
                              {
                                discount_percentage:
                                  Number(
                                    event.target.value
                                  ),
                              }
                            )
                          }
                        />
                      </label>

                    </div>
                  )}

                  <button
                    type="button"
                    className="offer-save-button"
                    onClick={() =>
                      handleSave(product)
                    }
                    disabled={
                      savingId === product.id
                    }
                  >
                    <IonIcon
                      icon={saveOutline}
                    />

                    {savingId === product.id
                      ? 'Guardando...'
                      : 'Guardar cambios'}
                  </button>

                </article>
              ))}

            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default OfferManagementPage;