import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  IonContent,
  IonIcon,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  arrowBackOutline,
  receiptOutline,
  timeOutline,
  checkmarkCircleOutline,
  bicycleOutline,
  closeCircleOutline,
} from 'ionicons/icons';

import {
  getOrders,
  type Order,
} from '../../services/orderService';

import './OrdersPage.css';

function OrdersPage() {
  const history = useHistory();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getOrders();

      setOrders(data);
    } catch (error) {
      console.error(
        'Error cargando pedidos:',
        error
      );

      if (
        error instanceof Error &&
        error.message.includes('sesión')
      ) {
        history.replace('/login');
        return;
      }

      setError(
        'No se pudieron cargar tus pedidos.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Se ejecuta cada vez que la página
    vuelve a mostrarse en Ionic.
  */
  useIonViewWillEnter(() => {
    loadOrders();
  });

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

  const getStatusIcon = (
    status: string
  ) => {
    switch (status) {
      case 'pending':
        return timeOutline;

      case 'confirmed':
      case 'preparing':
        return receiptOutline;

      case 'on_the_way':
        return bicycleOutline;

      case 'delivered':
        return checkmarkCircleOutline;

      case 'cancelled':
        return closeCircleOutline;

      default:
        return receiptOutline;
    }
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(date)
      .toLocaleDateString(
        'es-DO',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );
  };

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="orders-page">

          {/* Header */}
          <header className="orders-header">

            <button
              className="orders-back"
              onClick={() =>
                history.goBack()
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <div>

              <h1>
                Mis pedidos
              </h1>

              <span>
                Consulta el estado de tus compras
              </span>

            </div>

          </header>

          {/* Cargando */}
          {loading ? (

            <div className="orders-message">

              <p>
                Cargando pedidos...
              </p>

            </div>

          ) : error ? (

            /* Error */
            <div className="orders-message error">

              <p>
                {error}
              </p>

              <button
                className="orders-retry-button"
                onClick={loadOrders}
              >
                Intentar de nuevo
              </button>

            </div>

          ) : orders.length === 0 ? (

            /* Sin pedidos */
            <div className="orders-empty">

              <div className="orders-empty-icon">

                <IonIcon
                  icon={receiptOutline}
                />

              </div>

              <h2>
                No tienes pedidos todavía
              </h2>

              <p>
                Cuando realices una compra,
                aparecerá aquí.
              </p>

              <button
                onClick={() =>
                  history.push('/')
                }
              >
                Ver productos
              </button>

            </div>

          ) : (

            /* Lista de pedidos */
            <div className="orders-list">

              {orders.map((order) => (

                <article
                  className="order-card"
                  key={order.id}
                >

                  {/* Header pedido */}
                  <div className="order-card-header">

                    <div>

                      <span className="order-number">
                        Pedido #{order.id}
                      </span>

                      <span className="order-date">
                        {formatDate(
                          order.created_at
                        )}
                      </span>

                    </div>

                    {/* Estado */}
                    <div
                      className={`order-status status-${order.status}`}
                    >

                      <IonIcon
                        icon={getStatusIcon(
                          order.status
                        )}
                      />

                      <span>
                        {getStatusText(
                          order.status
                        )}
                      </span>

                    </div>

                  </div>

                  {/* Productos */}
                  <div className="order-products">

                    {(order.items ?? []).map(
                      (item) => (

                        <div
                          className="order-product"
                          key={item.id}
                        >

                          <div>

                            <strong>
                              {item.product_name}
                            </strong>

                            <span>

                              {item.quantity}

                              {' × '}

                              RD${' '}

                              {Number(
                                item.unit_price
                              ).toLocaleString(
                                'es-DO'
                              )}

                            </span>

                          </div>

                          <strong>

                            RD${' '}

                            {Number(
                              item.subtotal
                            ).toLocaleString(
                              'es-DO'
                            )}

                          </strong>

                        </div>

                      )
                    )}

                    {(order.items?.length ?? 0) === 0 && (

                      <p className="order-no-products">
                        No hay productos registrados.
                      </p>

                    )}

                  </div>

                  {/* Total */}
                  <div className="order-card-footer">

                    <span>
                      Total
                    </span>

                    <strong>

                      RD${' '}

                      {Number(
                        order.total
                      ).toLocaleString(
                        'es-DO'
                      )}

                    </strong>

                  </div>

                  {/* Ver detalle */}
                  <button
                    className="order-detail-button"
                    onClick={() =>
                      history.push(
                        `/pedidos/${order.id}`
                      )
                    }
                  >
                    Ver detalle
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

export default OrdersPage;