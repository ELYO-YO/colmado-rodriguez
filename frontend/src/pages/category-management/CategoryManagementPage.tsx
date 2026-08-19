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
  basketOutline,
  cubeOutline,
  createOutline,
  nutritionOutline,
  snowOutline,
  sparklesOutline,
  trashOutline,
  waterOutline,
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

function normalizeCategoryName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getCategoryIcon(name: string) {
  const category = normalizeCategoryName(name);

  if (
    category.includes('bebida') ||
    category.includes('refresco') ||
    category.includes('fria')
  ) {
    return snowOutline;
  }

  if (
    category.includes('viver') ||
    category.includes('abarrote')
  ) {
    return basketOutline;
  }

  if (
    category.includes('provision') ||
    category.includes('alimento')
  ) {
    return nutritionOutline;
  }

  if (
    category.includes('lacteo') ||
    category.includes('leche')
  ) {
    return waterOutline;
  }

  if (
    category.includes('enlatado') ||
    category.includes('enlat') ||
    category.includes('lata')
  ) {
    return cubeOutline;
  }

  if (
    category.includes('limpieza') ||
    category.includes('higiene')
  ) {
    return sparklesOutline;
  }

  return basketOutline;
}

function CategoryManagementPage() {
  const history = useHistory();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        const profile = await getProfile();

        if (profile.role !== 'admin') {
          history.replace('/dashboard');
          return;
        }

        const data = await getCategories();

        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar las categorías.'
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

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setError('');
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (editingId !== null) {
        const updated = await updateCategory(
          editingId,
          {
            name: name.trim(),
            image: '',
          }
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === updated.id
              ? updated
              : category
          )
        );

        setSuccess('Categoría actualizada correctamente.');
      } else {
        const created = await createCategory({
          name: name.trim(),
          image: '',
        });

        setCategories((current) => [
          ...current,
          created,
        ]);

        setSuccess('Categoría creada correctamente.');
      }

      setEditingId(null);
      setName('');
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

    if (!confirmed) {
      return;
    }

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
              className="category-back-button"
              onClick={() =>
                history.push('/dashboard')
              }
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <div>
              <span>Administración</span>
              <h1>Gestionar categorías</h1>
              <p>
                Crea y organiza las categorías del catálogo.
              </p>
            </div>
          </header>

          <div className="category-management-layout">

            <section className="category-form-card">
              <div className="category-form-title">
                <div className="category-form-icon">
                  <IonIcon
                    icon={
                      editingId !== null
                        ? createOutline
                        : addOutline
                    }
                  />
                </div>

                <div>
                  <h2>
                    {editingId !== null
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
                      setName(event.target.value)
                    }
                    placeholder="Ej. Bebidas"
                  />
                </label>

                {name.trim() && (
                  <div className="category-preview">
                    <span>Vista previa</span>

                    <div className="category-preview-box">
                      <div className="category-preview-icon">
                        <IonIcon
                          icon={getCategoryIcon(name)}
                        />
                      </div>

                      <strong>
                        {name.trim()}
                      </strong>
                    </div>
                  </div>
                )}

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
                  {editingId !== null && (
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
                      : editingId !== null
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
                  {categories.length}{' '}
                  {categories.length === 1
                    ? 'registrada'
                    : 'registradas'}
                </span>
              </div>

              {loading ? (
                <div className="category-message">
                  Cargando categorías...
                </div>
              ) : categories.length === 0 ? (
                <div className="category-message">
                  No hay categorías registradas.
                </div>
              ) : (
                <div className="category-list">
                  {categories.map((category) => (
                    <article
                      className="category-item"
                      key={category.id}
                    >
                      <div className="category-item-icon">
                        <IonIcon
                          icon={getCategoryIcon(
                            category.name
                          )}
                        />
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
                          className="category-edit-button"
                          onClick={() =>
                            handleEdit(category)
                          }
                          aria-label={`Editar ${category.name}`}
                        >
                          <IonIcon
                            icon={createOutline}
                          />
                        </button>

                        <button
                          type="button"
                          className="category-delete-button"
                          onClick={() =>
                            handleDelete(category)
                          }
                          disabled={
                            deletingId === category.id
                          }
                          aria-label={`Eliminar ${category.name}`}
                        >
                          <IonIcon
                            icon={trashOutline}
                          />
                        </button>
                      </div>
                    </article>
                  ))}
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