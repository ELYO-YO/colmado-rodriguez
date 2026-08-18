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
  addOutline,
  arrowBackOutline,
  createOutline,
  imageOutline,
  trashOutline,
} from 'ionicons/icons';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
} from '../../services/productAdminService';

import { getProfile } from '../../services/authService';

import './CategoryManagementPage.css';

function CategoryManagementPage() {
  const history = useHistory();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

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

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las categorías.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [history]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setImage('');
    setError('');
  };

  const handleEdit = (
    category: Category
  ) => {
    setEditingId(category.id);
    setName(category.name);
    setImage(category.image ?? '');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        'El nombre de la categoría es obligatorio.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (editingId) {
        const updated =
          await updateCategory(
            editingId,
            {
              name: name.trim(),
              image: image.trim(),
            }
          );

        setCategories((current) =>
          current.map((category) =>
            category.id === updated.id
              ? updated
              : category
          )
        );

        setSuccess(
          'Categoría actualizada correctamente.'
        );
      } else {
        const created =
          await createCategory({
            name: name.trim(),
            image: image.trim(),
          });

        setCategories((current) => [
          ...current,
          created,
        ]);

        setSuccess(
          'Categoría creada correctamente.'
        );
      }

      resetForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la categoría.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    category: Category
  ) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(category.id);
      setError('');
      setSuccess('');

      await deleteCategory(category.id);

      setCategories((current) =>
        current.filter(
          (item) =>
            item.id !== category.id
        )
      );

      if (editingId === category.id) {
        resetForm();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la categoría.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="category-management-page">

          <header className="category-management-header">
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
              <span>Administración</span>

              <h1>Gestionar categorías</h1>

              <p>
                Crea y organiza las categorías
                del catálogo.
              </p>
            </div>
          </header>

          <div className="category-management-layout">

            <section className="category-form-card">
              <div className="category-form-title">
                <IonIcon
                  icon={
                    editingId
                      ? createOutline
                      : addOutline
                  }
                />

                <div>
                  <h2>
                    {editingId
                      ? 'Editar categoría'
                      : 'Nueva categoría'}
                  </h2>

                  <span>
                    Completa los datos
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                <label>
                  Nombre *

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Ej. Bebidas"
                  />
                </label>

                <label>
                  Imagen

                  <div className="category-image-input">
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
                      placeholder="/images/categories/bebidas.jpg"
                    />
                  </div>
                </label>

                {error && (
                  <div className="category-form-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="category-form-success">
                    {success}
                  </div>
                )}

                <div className="category-form-actions">

                  {editingId && (
                    <button
                      type="button"
                      className="category-cancel-button"
                      onClick={resetForm}
                    >
                      Cancelar
                    </button>
                  )}

                  <button
                    type="submit"
                    className="category-save-button"
                    disabled={saving}
                  >
                    {saving
                      ? 'Guardando...'
                      : editingId
                        ? 'Guardar cambios'
                        : 'Crear categoría'}
                  </button>

                </div>
              </form>
            </section>

            <section className="category-list-card">
              <div className="category-list-header">
                <h2>Categorías</h2>

                <span>
                  {categories.length} registradas
                </span>
              </div>

              {loading ? (
                <div className="category-message">
                  Cargando...
                </div>
              ) : categories.length === 0 ? (
                <div className="category-message">
                  No hay categorías.
                </div>
              ) : (
                <div className="category-list">

                  {categories.map(
                    (category) => (
                      <article
                        className="category-item"
                        key={category.id}
                      >

                        <div className="category-image">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                            />
                          ) : (
                            <IonIcon
                              icon={imageOutline}
                            />
                          )}
                        </div>

                        <div className="category-info">
                          <strong>
                            {category.name}
                          </strong>

                          <span>
                            ID #{category.id}
                          </span>
                        </div>

                        <div className="category-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            aria-label="Editar"
                          >
                            <IonIcon
                              icon={createOutline}
                            />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={
                              deletingId ===
                              category.id
                            }
                            aria-label="Eliminar"
                          >
                            <IonIcon
                              icon={trashOutline}
                            />
                          </button>

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}
            </section>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default CategoryManagementPage;