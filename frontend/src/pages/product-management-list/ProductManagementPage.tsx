import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';
import {
  addOutline,
  arrowBackOutline,
  createOutline,
  searchOutline,
  trashOutline,
} from 'ionicons/icons';

import {
  deleteProduct,
  getAdminProducts,
  type AdminProduct,
} from '../../services/productAdminService';

import { getProfile } from '../../services/authService';

import './ProductManagementPage.css';

function ProductManagementPage() {
  const history = useHistory();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError('');

        const profile = await getProfile();

        if (profile.role !== 'admin') {
          history.replace('/dashboard');
          return;
        }

        const data = await getAdminProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar los productos.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [history]);

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return true;
    }

    const name = product.name?.toLowerCase() ?? '';
    const description = product.description?.toLowerCase() ?? '';
    const category = product.category?.name?.toLowerCase() ?? '';

    return (
      name.includes(search) ||
      description.includes(search) ||
      category.includes(search)
    );
  });

  const handleDelete = async (product: AdminProduct) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setError('');

      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      console.error('Error eliminando producto:', error);

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el producto.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: string | number | null | undefined) => {
    const value = Number(price ?? 0);

    return value.toLocaleString('es-DO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="product-management-page">
          <header className="product-management-header">
            <div className="product-management-header-left">
              <button
                type="button"
                className="product-management-back"
                onClick={() => history.push('/dashboard')}
                aria-label="Volver al dashboard"
              >
                <IonIcon icon={arrowBackOutline} />
              </button>

              <div>
                <span className="product-management-eyebrow">
                  Administración
                </span>

                <h1>Gestionar productos</h1>

                <p>
                  Consulta, edita y elimina productos del catálogo.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="product-management-add"
              onClick={() => history.push('/dashboard/productos/nuevo')}
            >
              <IonIcon icon={addOutline} />
              <span>Agregar</span>
            </button>
          </header>

          <div className="product-management-search">
            <IonIcon icon={searchOutline} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar producto o categoría..."
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

          {error && (
            <div className="product-management-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="product-management-message">
              Cargando productos...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="product-management-empty">
              <h2>No encontramos productos</h2>

              <p>
                {searchTerm
                  ? 'Prueba buscando con otro nombre o categoría.'
                  : 'Todavía no hay productos registrados.'}
              </p>
            </div>
          ) : (
            <div className="product-management-grid">
              {filteredProducts.map((product) => (
                <article
                  className="product-management-card"
                  key={product.id}
                >
                  <div className="product-management-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <span className="product-management-no-image">
                        Sin imagen
                      </span>
                    )}

                    {product.is_offer && (
                      <span className="product-offer-badge">
                        Oferta {product.discount_percentage}%
                      </span>
                    )}
                  </div>

                  <div className="product-management-body">
                    <div className="product-management-product-top">
                      <div className="product-management-product-name">
                        <h2>{product.name}</h2>

                        <span>
                          {product.category?.name ?? 'Sin categoría'}
                        </span>
                      </div>

                      <span
                        className={
                          product.available
                            ? 'product-availability available'
                            : 'product-availability unavailable'
                        }
                      >
                        {product.available
                          ? 'Disponible'
                          : 'No disponible'}
                      </span>
                    </div>

                    <div className="product-management-price">
                      {product.is_offer && product.old_price && (
                        <span className="product-management-old-price">
                          RD$ {formatPrice(product.old_price)}
                        </span>
                      )}

                      <strong>
                        RD$ {formatPrice(product.price)}
                      </strong>
                    </div>

                    <div className="product-management-actions">
                      <button
                        type="button"
                        className="product-edit-button"
                        onClick={() =>
                          history.push(
                            `/dashboard/productos/${product.id}/editar`
                          )
                        }
                      >
                        <IonIcon icon={createOutline} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="product-delete-button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                      >
                        <IonIcon icon={trashOutline} />

                        {deletingId === product.id
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ProductManagementPage;