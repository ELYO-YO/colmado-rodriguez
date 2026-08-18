import {
  useEffect,
  useState,
} from 'react';

import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  peopleOutline,
  searchOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import {
  getAdminUsers,
  updateUserActive,
  updateUserRole,
  type AdminUser,
} from '../../services/userAdminService';

import {
  getProfile,
} from '../../services/authService';

import './UserManagementPage.css';

function UserManagementPage() {
  const history = useHistory();

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        const profile =
          await getProfile();

        if (
          profile.role !== 'admin'
        ) {
          history.replace(
            '/dashboard'
          );

          return;
        }

        const data =
          await getAdminUsers();

        setUsers(data);
      } catch (error) {
        console.error(
          'Error cargando usuarios:',
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los usuarios.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [history]);

  const normalizedSearch =
    searchTerm
      .trim()
      .toLowerCase();

  const filteredUsers =
    users.filter((user) => {
      const fullName =
        `${user.first_name} ${user.last_name}`
          .trim()
          .toLowerCase();

      return (
        normalizedSearch === '' ||
        user.username
          .toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        user.email
          .toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        fullName.includes(
          normalizedSearch
        )
      );
    });

  const getRoleText = (
    role: string
  ) => {
    switch (role) {
      case 'admin':
        return 'Administrador';

      case 'employee':
        return 'Empleado';

      default:
        return 'Cliente';
    }
  };

  const handleRoleChange = async (
    user: AdminUser,
    role:
      | 'customer'
      | 'employee'
  ) => {
    try {
      setUpdatingId(
        user.id
      );

      setError('');

      const updated =
        await updateUserRole(
          user.id,
          role
        );

      setUsers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updated.id
                ? updated
                : item
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el rol.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleActiveChange =
    async (
      user: AdminUser
    ) => {
      const nextStatus =
        !user.is_active;

      const action =
        nextStatus
          ? 'activar'
          : 'desactivar';

      const confirmed =
        window.confirm(
          `¿Seguro que deseas ${action} a ${user.username}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setUpdatingId(
          user.id
        );

        setError('');

        const updated =
          await updateUserActive(
            user.id,
            nextStatus
          );

        setUsers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                updated.id
                  ? updated
                  : item
            )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el usuario.'
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const totalEmployees =
    users.filter(
      (user) =>
        user.role ===
        'employee'
    ).length;

  const totalCustomers =
    users.filter(
      (user) =>
        user.role ===
        'customer'
    ).length;

  const totalActive =
    users.filter(
      (user) =>
        user.is_active
    ).length;

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="user-management-page">

          <header className="user-management-header">

            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();

                history.push(
                  '/dashboard'
                );
              }}
              aria-label="Volver"
            >
              <IonIcon
                icon={
                  arrowBackOutline
                }
              />
            </button>

            <div>
              <span>
                Administración
              </span>

              <h1>
                Gestionar usuarios
              </h1>

              <p>
                Administra clientes
                y empleados del sistema.
              </p>
            </div>

          </header>

          <section className="user-management-stats">

            <article>
              <IonIcon
                icon={
                  peopleOutline
                }
              />

              <div>
                <span>
                  Usuarios
                </span>

                <strong>
                  {users.length}
                </strong>
              </div>
            </article>

            <article>
              <IonIcon
                icon={
                  shieldCheckmarkOutline
                }
              />

              <div>
                <span>
                  Empleados
                </span>

                <strong>
                  {totalEmployees}
                </strong>
              </div>
            </article>

            <article>
              <IonIcon
                icon={
                  personOutline
                }
              />

              <div>
                <span>
                  Clientes
                </span>

                <strong>
                  {totalCustomers}
                </strong>
              </div>
            </article>

            <article>
              <IonIcon
                icon={
                  peopleOutline
                }
              />

              <div>
                <span>
                  Activos
                </span>

                <strong>
                  {totalActive}
                </strong>
              </div>
            </article>

          </section>

          <div className="user-management-search">

            <IonIcon
              icon={searchOutline}
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Buscar por usuario, nombre o correo..."
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() =>
                  setSearchTerm('')
                }
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}

          </div>

          {error && (
            <div className="user-management-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="user-management-message">
              Cargando usuarios...
            </div>
          ) : filteredUsers.length ===
            0 ? (
            <div className="user-management-message">
              No se encontraron
              usuarios.
            </div>
          ) : (
            <div className="user-management-list">

              {filteredUsers.map(
                (user) => (
                  <article
                    className="user-management-card"
                    key={user.id}
                  >

                    <div className="user-management-avatar">
                      {(
                        user.first_name ||
                        user.username
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="user-management-info">

                      <div className="user-management-name">
                        <strong>
                          {user.first_name ||
                          user.last_name
                            ? `${user.first_name} ${user.last_name}`.trim()
                            : user.username}
                        </strong>

                        <span>
                          @{user.username}
                        </span>
                      </div>

                      <span className="user-management-email">
                        {user.email ||
                          'Sin correo'}
                      </span>

                    </div>

                    <div className="user-management-role">

                      <span
                        className={`role-badge role-${user.role}`}
                      >
                        {getRoleText(
                          user.role
                        )}
                      </span>

                    </div>

                    <div className="user-management-status">

                      <span
                        className={
                          user.is_active
                            ? 'active'
                            : 'inactive'
                        }
                      >
                        {user.is_active
                          ? 'Activo'
                          : 'Inactivo'}
                      </span>

                    </div>

                    <div className="user-management-actions">

                      {user.role !==
                        'admin' && (
                        <select
                          value={
                            user.role
                          }
                          onChange={(
                            event
                          ) =>
                            handleRoleChange(
                              user,
                              event
                                .target
                                .value as
                                | 'customer'
                                | 'employee'
                            )
                          }
                          disabled={
                            updatingId ===
                            user.id
                          }
                        >
                          <option
                            value="customer"
                          >
                            Cliente
                          </option>

                          <option
                            value="employee"
                          >
                            Empleado
                          </option>
                        </select>
                      )}

                      {user.role !==
                        'admin' && (
                        <button
                          type="button"
                          className={
                            user.is_active
                              ? 'deactivate'
                              : 'activate'
                          }
                          onClick={() =>
                            handleActiveChange(
                              user
                            )
                          }
                          disabled={
                            updatingId ===
                            user.id
                          }
                        >
                          {updatingId ===
                          user.id
                            ? 'Actualizando...'
                            : user.is_active
                              ? 'Desactivar'
                              : 'Activar'}
                        </button>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default UserManagementPage;