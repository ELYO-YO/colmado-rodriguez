import {
  useEffect,
  useState,
} from 'react';

import {
  useHistory,
} from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  chevronForwardOutline,
  receiptOutline,
  timeOutline,
} from 'ionicons/icons';

import {
  cancelOrder,
  getOrders,
  type Order,
} from '../../services/orderService';

import './OrdersPage.css';


function OrdersPage() {
  const history = useHistory();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [cancellingId, setCancellingId] =
    useState<number | null>(null);


  /* =====================================
     CARGAR PEDIDOS
  ====================================== */

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const data =
          await getOrders();

        if (isMounted) {
          setOrders(data);
          setError('');
        }
      } catch (error) {
        console.error(
          'Error cargando pedidos:',
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

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);


  /* =====================================
     ESTADO EN ESPAÑOL
  ====================================== */

  const getStatusText = (
    status: string
  ) => {
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


  /* =====================================
     FORMATEAR FECHA
  ====================================== */

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString(
      'es-DO',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };


  /* =====================================
     VER DETALLE
  ====================================== */

  const handleViewDetail = (
    orderId: number
  ) => {
    history.push(
      `/pedidos/${orderId}`
    );
  };


  /* =====================================
     CANCELAR PEDIDO
  ====================================== */

  const handleCancel = async (
    order: Order
  ) => {
    if (
      order.status !== 'pending'
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `¿Seguro que deseas cancelar el pedido #${order.id}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(
        order.id
      );

      setError('');

      const updatedOrder =
        await cancelOrder(
          order.id
        );

      setOrders(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updatedOrder.id
                ? updatedOrder
                : item
          )
      );
    } catch (error) {
      console.error(
        'Error cancelando pedido:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cancelar el pedido.'
      );
    } finally {
      setCancellingId(null);
    }
  };


  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="orders-page">

          {/* =====================================
              HEADER
          ====================================== */}

          <header className="orders-header">

            <button
              type="button"
              className="orders-back-button"
              onClick={(event) => {
                event.currentTarget.blur();

                history.push('/');
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
              <h1>
                Mis pedidos
              </h1>

              <span>
                Consulta el estado
                de tus pedidos
              </span>
            </div>

          </header>


          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="orders-error">
              {error}
            </div>
          )}


          {/* =====================================
              CARGANDO
          ====================================== */}

          {loading ? (
            <div className="orders-message">
              Cargando pedidos...
            </div>
          ) : orders.length === 0 ? (

            /* =====================================
               SIN PEDIDOS
            ====================================== */

            <div className="orders-empty">

              <IonIcon
                icon={
                  receiptOutline
                }
              />

              <h2>
                No tienes pedidos
              </h2>

              <p>
                Cuando realices una compra,
                aparecerá aquí.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.currentTarget.blur();

                  history.push('/');
                }}
              >
                Ir al catálogo
              </button>

            </div>

          ) : (

            /* =====================================
               LISTA DE PEDIDOS
            ====================================== */

            <div className="orders-list">

              {orders.map(
                (order) => (
                  <article
                    className="order-card"
                    key={order.id}
                  >

                    {/* PEDIDO + ESTADO */}

                    <div className="order-card-top">

                      <div>
                        <strong>
                          Pedido #{order.id}
                        </strong>

                        <span>
                          {formatDate(
                            order.created_at
                          )}
                        </span>
                      </div>

                      <span
                        className={
                          `order-status status-${order.status}`
                        }
                      >
                        {getStatusText(
                          order.status
                        )}
                      </span>

                    </div>


                    {/* INFORMACIÓN */}

                    <div className="order-card-info">

                      <div>
                        <IonIcon
                          icon={
                            timeOutline
                          }
                        />

                        <span>
                          {order.items?.length ??
                            0}{' '}
                          {(
                            order.items?.length ??
                            0
                          ) === 1
                            ? 'producto'
                            : 'productos'}
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


                    {/* =====================================
                        ACCIONES DEL CLIENTE
                    ====================================== */}

                    <div className="order-card-actions">

                      {/* El cliente solo puede cancelar
                          mientras el pedido está pendiente */}

                      {order.status ===
                        'pending' && (
                        <button
                          type="button"
                          className="order-cancel-button-list"
                          onClick={() =>
                            handleCancel(
                              order
                            )
                          }
                          disabled={
                            cancellingId ===
                            order.id
                          }
                        >
                          {cancellingId ===
                          order.id
                            ? 'Cancelando...'
                            : 'Cancelar pedido'}
                        </button>
                      )}


                      {/* VER DETALLE */}

                      <button
                        type="button"
                        className="order-detail-button"
                        onClick={(event) => {
                          event.currentTarget.blur();

                          handleViewDetail(
                            order.id
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
                )
              )}

            </div>
          )}

        </div>

      </IonContent>
    </IonPage>
  );
}

export default OrdersPage;