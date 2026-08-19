import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  addCircleOutline,
  bagHandleOutline,
  cartOutline,
  cashOutline,
  chevronForwardOutline,
  gridOutline,
  peopleOutline,
  pricetagOutline,
  receiptOutline,
  storefrontOutline,
} from 'ionicons/icons';

import {
  getDashboardStats,
  type DashboardStats,
} from '../../services/dashboardService';

import {
  getProfile,
  type UserProfile,
} from '../../services/authService';

import './DashboardPage.css';

function DashboardPage() {
  const history = useHistory();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const userProfile =
          await getProfile();

        if (
          userProfile.role !== 'admin' &&
          userProfile.role !== 'employee'
        ) {
          history.replace('/');
          return;
        }

        const dashboardStats =
          await getDashboardStats();

        if (isMounted) {
          setProfile(userProfile);
          setStats(dashboardStats);
          setError('');
        }
      } catch (error) {
        console.error(
          'Error cargando dashboard:',
          error
        );

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudo cargar el dashboard.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const interval =
      window.setInterval(
        loadDashboard,
        20000
      );

    return () => {
      isMounted = false;

      window.clearInterval(
        interval
      );
    };
  }, [history]);

  const displayName =
    profile?.first_name ||
    profile?.last_name
      ? `${profile?.first_name ?? ''} ${
          profile?.last_name ?? ''
        }`.trim()
      : profile?.username ?? 'Usuario';

  const isAdmin =
    profile?.role === 'admin';

  const isEmployee =
    profile?.role === 'employee';

  const roleText =
    isAdmin
      ? 'Administrador'
      : 'Empleado';

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="dashboard-page">

          <header
            className={`dashboard-header ${
              isEmployee
                ? 'employee-dashboard-header'
                : ''
            }`}
          >
            <div className="dashboard-header-content">
              <span className="dashboard-role">
                {roleText}
              </span>

              <h1>
                Hola, {displayName}
              </h1>

              <p>
                {isAdmin
                  ? 'Panel de administración de Colmado Rodríguez'
                  : 'Panel operativo de Colmado Rodríguez'}
              </p>
            </div>

            <button
              type="button"
              className="dashboard-profile-button"
              onClick={() =>
                history.push('/perfil')
              }
            >
              Mi perfil
            </button>
          </header>

          {loading ? (
            <div className="dashboard-message">
              Cargando dashboard...
            </div>
          ) : error ? (
            <div className="dashboard-message error">
              {error}
            </div>
          ) : stats ? (
            <>

              {isAdmin && (
                <section className="dashboard-stats">
                  <article className="dashboard-stat-card revenue">
                    <div className="dashboard-stat-icon red">
                      <IonIcon
                        icon={cashOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Ingresos totales
                      </span>

                      <strong>
                        RD${' '}
                        {Number(
                          stats.total_revenue
                        ).toLocaleString(
                          'es-DO'
                        )}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={receiptOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Pedidos
                      </span>

                      <strong>
                        {stats.total_orders}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={storefrontOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Productos
                      </span>

                      <strong>
                        {stats.total_products}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon red">
                      <IonIcon
                        icon={pricetagOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Ofertas activas
                      </span>

                      <strong>
                        {stats.active_offers}
                      </strong>
                    </div>
                  </article>
                </section>
              )}

              {isEmployee && (
                <section className="dashboard-stats employee-stats">
                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={receiptOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Pendientes
                      </span>

                      <strong>
                        {stats.pending_orders}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={receiptOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Preparando
                      </span>

                      <strong>
                        {stats.preparing_orders}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={cartOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        En camino
                      </span>

                      <strong>
                        {stats.on_the_way_orders}
                      </strong>
                    </div>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                      <IonIcon
                        icon={receiptOutline}
                      />
                    </div>

                    <div className="dashboard-stat-info">
                      <span>
                        Entregados
                      </span>

                      <strong>
                        {stats.delivered_orders}
                      </strong>
                    </div>
                  </article>
                </section>
              )}

              <section className="dashboard-orders">
                <div className="dashboard-section-header">
                  <div>
                    <h2>
                      Estado de pedidos
                    </h2>

                    <span>
                      Resumen de operaciones
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      history.push(
                        '/gestion-pedidos'
                      )
                    }
                  >
                    Ver pedidos

                    <IonIcon
                      icon={
                        chevronForwardOutline
                      }
                    />
                  </button>
                </div>

                <div className="dashboard-order-stats">
                  <div>
                    <span>
                      Pendientes
                    </span>

                    <strong>
                      {stats.pending_orders}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Confirmados
                    </span>

                    <strong>
                      {stats.confirmed_orders}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Preparando
                    </span>

                    <strong>
                      {stats.preparing_orders}
                    </strong>
                  </div>

                  <div>
                    <span>
                      En camino
                    </span>

                    <strong>
                      {stats.on_the_way_orders}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Entregados
                    </span>

                    <strong>
                      {stats.delivered_orders}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Cancelados
                    </span>

                    <strong>
                      {stats.cancelled_orders}
                    </strong>
                  </div>
                </div>
              </section>

              {isAdmin && (
                <section className="dashboard-actions">
                  <div className="dashboard-section-header">
                    <div>
                      <h2>
                        Administración
                      </h2>

                      <span>
                        Herramientas de gestión
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-action-grid">

                    <button
                      type="button"
                      className="dashboard-action-card action-red"
                      onClick={() =>
                        history.push(
                          '/dashboard/productos/nuevo'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={
                            addCircleOutline
                          }
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Agregar producto
                        </strong>

                        <span>
                          Registrar un producto nuevo
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/dashboard/productos'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={
                            bagHandleOutline
                          }
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar productos
                        </strong>

                        <span>
                          Editar, buscar y eliminar productos
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card action-red"
                      onClick={() =>
                        history.push(
                          '/dashboard/ofertas'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={
                            pricetagOutline
                          }
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar ofertas
                        </strong>

                        <span>
                          Crear y modificar promociones
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/dashboard/categorias'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={gridOutline}
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar categorías
                        </strong>

                        <span>
                          Crear y organizar categorías
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/dashboard/usuarios'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={peopleOutline}
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar usuarios
                        </strong>

                        <span>
                          Administrar clientes y empleados
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/gestion-pedidos'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={cartOutline}
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar pedidos
                        </strong>

                        <span>
                          Revisar pedidos de clientes
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                  </div>
                </section>
              )}

              {isEmployee && (
                <section className="dashboard-actions employee-actions">
                  <div className="dashboard-section-header">
                    <div>
                      <h2>
                        Acciones de trabajo
                      </h2>

                      <span>
                        Gestiona las operaciones del día
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-action-grid">
                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/gestion-pedidos'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={cartOutline}
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Gestionar pedidos
                        </strong>

                        <span>
                          Revisar y actualizar pedidos
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>

                    <button
                      type="button"
                      className="dashboard-action-card"
                      onClick={() =>
                        history.push(
                          '/dashboard/productos/consulta'
                        )
                      }
                    >
                      <div className="dashboard-action-icon">
                        <IonIcon
                          icon={
                            storefrontOutline
                          }
                        />
                      </div>

                      <div className="dashboard-action-content">
                        <strong>
                          Consultar productos
                        </strong>

                        <span>
                          Ver precios, ofertas y disponibilidad
                        </span>
                      </div>

                      <IonIcon
                        className="dashboard-action-arrow"
                        icon={
                          chevronForwardOutline
                        }
                      />
                    </button>
                  </div>
                </section>
              )}

            </>
          ) : null}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default DashboardPage;