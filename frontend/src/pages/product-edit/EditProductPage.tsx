import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  useHistory,
  useParams,
} from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  imageOutline,
  saveOutline,
} from 'ionicons/icons';

import {
  getAdminProductById,
  getCategories,
  updateAdminProduct,
  type Category,
} from '../../services/productAdminService';

import { getProfile } from '../../services/authService';

import './EditProductPage.css';

interface RouteParams {
  id: string;
}

function EditProductPage() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();

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
  const [discountPercentage, setDiscountPercentage] =
    useState('');
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

        const productId = Number(id);

        if (Number.isNaN(productId)) {
          setError('Producto inválido.');
          return;
        }

        const [
          product,
          categoryData,
        ] = await Promise.all([
          getAdminProductById(productId),
          getCategories(),
        ]);

        setCategories(categoryData);

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setImage(product.image ?? '');
        setCategoryId(
          product.category
            ? String(product.category.id)
            : ''
        );
        setAvailable(product.available);
        setIsOffer(product.is_offer);
        setDiscountPercentage(
          String(product.discount_percentage ?? 0)
        );
        setOldPrice(
          product.old_price ?? ''
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el producto.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, history]);

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    if (!description.trim()) {
      setError(
        'La descripción es obligatoria.'
      );
      return;
    }

    if (
      !price ||
      Number(price) <= 0
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

      await updateAdminProduct(
        Number(id),
        {
          name: name.trim(),
          description:
            description.trim(),
          price,
          image: image.trim(),
          category_id:
            categoryId
              ? Number(categoryId)
              : null,
          available,
          is_offer: isOffer,
          discount_percentage:
            isOffer
              ? Number(
                  discountPercentage
                )
              : 0,
          old_price:
            isOffer
              ? oldPrice
              : null,
        }
      );

      setSuccess(
        'Producto actualizado correctamente.'
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el producto.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className="edit-product-message">
            Cargando producto...
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="edit-product-page">

          <header className="edit-product-header">
            <button
              type="button"
              onClick={() =>
                history.push(
                  '/dashboard/productos'
                )
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <div>
              <span>Administración</span>

              <h1>Editar producto</h1>

              <p>
                Modifica la información
                del producto.
              </p>
            </div>
          </header>

          {error && (
            <div className="edit-product-error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-product-success">
              {success}
            </div>
          )}

          <form
            className="edit-product-form"
            onSubmit={handleSubmit}
          >

            <section className="edit-product-card">
              <h2>Información general</h2>

              <div className="edit-product-grid">

                <label>
                  Nombre

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Categoría

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
                </label>

                <label>
                  Precio

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
                  />
                </label>

                <label>
                  Imagen

                  <div className="edit-image-input">
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
                    />
                  </div>
                </label>

              </div>

              <label className="edit-product-full">
                Descripción

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                />
              </label>
            </section>

            <section className="edit-product-card">
              <h2>
                Disponibilidad y oferta
              </h2>

              <label className="edit-switch-row">
                <div>
                  <strong>
                    Disponible
                  </strong>

                  <span>
                    Mostrar el producto
                    para comprar.
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

              <label className="edit-switch-row">
                <div>
                  <strong>
                    En oferta
                  </strong>

                  <span>
                    Mostrar promoción
                    del producto.
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
                <div className="edit-product-grid offer">
                  <label>
                    Precio anterior

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
                    />
                  </label>

                  <label>
                    Descuento %

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
                    />
                  </label>
                </div>
              )}
            </section>

            <div className="edit-product-actions">
              <button
                type="button"
                className="edit-product-cancel"
                onClick={() =>
                  history.push(
                    '/dashboard/productos'
                  )
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="edit-product-save"
                disabled={saving}
              >
                <IonIcon
                  icon={saveOutline}
                />

                {saving
                  ? 'Guardando...'
                  : 'Guardar cambios'}
              </button>
            </div>

          </form>

        </div>
      </IonContent>
    </IonPage>
  );
}

export default EditProductPage;