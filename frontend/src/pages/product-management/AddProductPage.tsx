import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  checkmarkCircleOutline,
  imageOutline,
  pricetagOutline,
} from 'ionicons/icons';

import {
  createProduct,
  getCategories,
  type Category,
} from '../../services/productAdminService';

import {
  getProfile,
} from '../../services/authService';

import './AddProductPage.css';

function AddProductPage() {
  const history = useHistory();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] =
    useState('');

  const [available, setAvailable] =
    useState(true);

  const [isOffer, setIsOffer] =
    useState(false);

  const [
    discountPercentage,
    setDiscountPercentage,
  ] = useState('');

  const [oldPrice, setOldPrice] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const profile = await getProfile();

        if (profile.role !== 'admin') {
          history.replace('/dashboard');
          return;
        }

        const categoryData =
          await getCategories();

        setCategories(categoryData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la página.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [history]);

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !price
    ) {
      setError(
        'Completa los campos obligatorios.'
      );
      return;
    }

    if (
      Number(price) <= 0 ||
      Number.isNaN(Number(price))
    ) {
      setError(
        'Ingresa un precio válido.'
      );
      return;
    }

    if (
      isOffer &&
      (
        !oldPrice ||
        Number(oldPrice) <= 0 ||
        Number(discountPercentage) <= 0
      )
    ) {
      setError(
        'Completa los datos de la oferta.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price,
        image: image.trim(),
        category_id: categoryId
          ? Number(categoryId)
          : null,
        available,
        is_offer: isOffer,
        discount_percentage: isOffer
          ? Number(discountPercentage)
          : 0,
        old_price: isOffer
          ? oldPrice
          : null,
      });

      setSuccess(
        'Producto agregado correctamente.'
      );

      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategoryId('');
      setAvailable(true);
      setIsOffer(false);
      setDiscountPercentage('');
      setOldPrice('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo agregar el producto.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className="add-product-message">
            Cargando...
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="add-product-page">

          <header className="add-product-header">
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
                Agregar producto
              </h1>

              <p>
                Registra un nuevo producto
                en el catálogo.
              </p>
            </div>
          </header>

          <form
            className="add-product-form"
            onSubmit={handleSubmit}
          >

            <section className="product-form-card">
              <div className="product-form-title">
                <IonIcon
                  icon={pricetagOutline}
                />

                <div>
                  <h2>
                    Información del producto
                  </h2>

                  <span>
                    Datos principales
                  </span>
                </div>
              </div>

              <div className="product-form-grid">

                <div className="product-form-field">
                  <label>
                    Nombre *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Ej. Coca-Cola 2L"
                  />
                </div>

                <div className="product-form-field">
                  <label>
                    Categoría
                  </label>

                  <select
                    value={categoryId}
                    onChange={(event) =>
                      setCategoryId(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Sin categoría
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
                </div>

                <div className="product-form-field">
                  <label>
                    Precio (RD$) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="product-form-field">
                  <label>
                    Imagen
                  </label>

                  <div className="product-image-input">
                    <IonIcon
                      icon={imageOutline}
                    />

                    <input
                      type="text"
                      value={image}
                      onChange={(event) =>
                        setImage(
                          event.target.value
                        )
                      }
                      placeholder="/images/products/producto.jpg"
                    />
                  </div>
                </div>

              </div>

              <div className="product-form-field full">
                <label>
                  Descripción *
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe el producto..."
                  rows={4}
                />
              </div>
            </section>

            <section className="product-form-card">
              <div className="product-form-title">
                <IonIcon
                  icon={checkmarkCircleOutline}
                />

                <div>
                  <h2>
                    Disponibilidad y oferta
                  </h2>

                  <span>
                    Configuración de venta
                  </span>
                </div>
              </div>

              <label className="product-switch-row">
                <div>
                  <strong>
                    Producto disponible
                  </strong>

                  <span>
                    Mostrar el producto
                    disponible para comprar.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={available}
                  onChange={(event) =>
                    setAvailable(
                      event.target.checked
                    )
                  }
                />
              </label>

              <label className="product-switch-row">
                <div>
                  <strong>
                    Producto en oferta
                  </strong>

                  <span>
                    Aplicar una promoción
                    al producto.
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={isOffer}
                  onChange={(event) =>
                    setIsOffer(
                      event.target.checked
                    )
                  }
                />
              </label>

              {isOffer && (
                <div className="product-offer-fields">

                  <div className="product-form-field">
                    <label>
                      Precio anterior *
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={oldPrice}
                      onChange={(event) =>
                        setOldPrice(
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="product-form-field">
                    <label>
                      Descuento (%) *
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={
                        discountPercentage
                      }
                      onChange={(event) =>
                        setDiscountPercentage(
                          event.target.value
                        )
                      }
                      placeholder="10"
                    />
                  </div>

                </div>
              )}
            </section>

            {error && (
              <div className="product-form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="product-form-success">
                {success}
              </div>
            )}

            <div className="product-form-actions">
              <button
                type="button"
                className="product-cancel-button"
                onClick={() =>
                  history.push('/dashboard')
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="product-save-button"
                disabled={saving}
              >
                {saving
                  ? 'Guardando...'
                  : 'Guardar producto'}
              </button>
            </div>

          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default AddProductPage;