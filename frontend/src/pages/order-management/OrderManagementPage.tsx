import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowBackOutline,
  chevronForwardOutline,
  receiptOutline,
  timeOutline,
  searchOutline,
} from 'ionicons/icons';

import {
  getOrders,
  updateOrderStatus,
  type Order,
} from '../../services/orderService';

import { getProfile } from '../../services/authService';

import './OrderManagementPage.css';

function OrderManagementPage() {
  const history = useHistory();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        const profile = await getProfile();

        if (
          profile.role !== 'admin' &&
          profile.role !== 'employee'
        ) {
          history.replace('/');
          return;
        }

        const data = await getOrders();

        if (isMounted) {
          setOrders(data);
          setError('');
        }
      } catch (error) {
        console.error(
          'Error cargando gestión de pedidos:',
          error
        );

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar los pedidos.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    const interval = window.setInterval(() => {
      loadPage();
    }, 20000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [history]);

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all' ||
      order.status === selectedStatus;

    const matchesSearch =
      normalizedSearch === '' ||
      order.customer_name
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(order.id).includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'on_the_way':
        return 'En camino';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getNextStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Confirmar';
      case 'confirmed':
        return 'Preparar';
      case 'preparing':
        return 'Enviar';
      case 'on_the_way':
        return 'Entregar';
      default:
        return '';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-DO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') {
      return orders.length;
    }

    return orders.filter(
      (order) => order.status === status
    ).length;
  };

  const handleUpdateStatus = async (
    orderId: number
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setUpdateError('');

      const updatedOrder =
        await updateOrderStatus(orderId);

      setOrders((current) =>
        current.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error(
        'Error actualizando pedido:',
        error
      );

      setUpdateError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el pedido.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="order-management-page">

          <header className="order-management-header">
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                history.goBack();
              }}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <div>
              <h1>Gestión de pedidos</h1>
              <span>
                Administra los pedidos de los clientes
              </span>
            </div>
          </header>

          {loading ? (
            <div className="order-management-message">
              Cargando pedidos...
            </div>
          ) : error ? (
            <div className="order-management-message error">
              {error}
            </div>
          ) : (
            <>

              <div className="order-management-summary">
                <div>
                  <span>Total</span>
                  <strong>{orders.length}</strong>
                </div>

                <div>
                  <span>Pendientes</span>
                  <strong>
                    {getStatusCount('pending')}
                  </strong>
                </div>

                <div>
                  <span>Preparando</span>
                  <strong>
                    {getStatusCount('preparing')}
                  </strong>
                </div>

                <div>
                  <span>En camino</span>
                  <strong>
                    {getStatusCount('on_the_way')}
                  </strong>
                </div>
              </div>

              <div className="order-management-search">
                <IonIcon icon={searchOutline} />

                <input
                  type="search"
                  placeholder="Buscar por pedido o cliente..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
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

              <div className="order-management-filters">
                <button
                  type="button"
                  className={
                    selectedStatus === 'all'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('all')
                  }
                >
                  Todos
                  <span>
                    {getStatusCount('all')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'pending'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('pending')
                  }
                >
                  Pendientes
                  <span>
                    {getStatusCount('pending')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'confirmed'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('confirmed')
                  }
                >
                  Confirmados
                  <span>
                    {getStatusCount('confirmed')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'preparing'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('preparing')
                  }
                >
                  Preparando
                  <span>
                    {getStatusCount('preparing')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'on_the_way'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('on_the_way')
                  }
                >
                  En camino
                  <span>
                    {getStatusCount('on_the_way')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'delivered'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('delivered')
                  }
                >
                  Entregados
                  <span>
                    {getStatusCount('delivered')}
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    selectedStatus === 'cancelled'
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setSelectedStatus('cancelled')
                  }
                >
                  Cancelados
                  <span>
                    {getStatusCount('cancelled')}
                  </span>
                </button>
              </div>

              {updateError && (
                <div className="order-management-update-error">
                  {updateError}
                </div>
              )}

              {filteredOrders.length === 0 ? (
                <div className="order-management-empty">
                  <IonIcon icon={receiptOutline} />

                  <h2>No hay pedidos</h2>

                  <p>
                    No encontramos pedidos con estos filtros.
                  </p>
                </div>
              ) : (
                <div className="order-management-list">
                  {filteredOrders.map((order) => (
                    <article
                      className="management-order-card"
                      key={order.id}
                    >

                      <div className="management-order-top">
                        <div>
                          <strong>
                            Pedido #{order.id}
                          </strong>

                          <span>
                            {order.customer_name}
                          </span>
                        </div>

                        <span
                          className={`management-status status-${order.status}`}
                        >
                          {getStatusText(
                            order.status
                          )}
                        </span>
                      </div>

                      <div className="management-order-info">
                        <div>
                          <IonIcon
                            icon={timeOutline}
                          />

                          <span>
                            {formatDate(
                              order.created_at
                            )}
                          </span>
                        </div>

                        <strong>
                          RD${' '}
                          {Number(
                            order.total
                          ).toLocaleString(
                            'es-DO'
                          )}
                        </strong>
                      </div>

                      <div className="management-order-actions">

                        {order.status !== 'delivered' &&
                          order.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="management-update-button"
                            onClick={() =>
                              handleUpdateStatus(
                                order.id
                              )
                            }
                            disabled={
                              updatingOrderId ===
                              order.id
                            }
                          >
                            {updatingOrderId ===
                            order.id
                              ? 'Actualizando...'
                              : getNextStatusText(
                                  order.status
                                )}
                          </button>
                        )}

                        <button
                          type="button"
                          className="management-detail-button"
                          onClick={(event) => {
                            event.currentTarget.blur();

                            history.push(
                              `/gestion-pedidos/${order.id}`
                            );
                          }}
                        >
                          Ver detalle

                          <IonIcon
                            icon={
                              chevronForwardOutline
                            }
                          />
                        </button>

                      </div>

                    </article>
                  ))}
                </div>
              )}

            </>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default OrderManagementPage;