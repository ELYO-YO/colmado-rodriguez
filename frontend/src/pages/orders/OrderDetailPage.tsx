import {
  useEffect,
  useState,
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
  callOutline,
  cardOutline,
  locationOutline,
  receiptOutline,
  timeOutline,
} from 'ionicons/icons';

import {
  cancelOrder,
  getOrderById,
  type Order,
} from '../../services/orderService';

import './OrderDetailPage.css';


interface RouteParams {
  id: string;
}


function OrderDetailPage() {
  const history = useHistory();

  const { id } =
    useParams<RouteParams>();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [cancelling, setCancelling] =
    useState(false);


  /* =====================================
     CARGAR PEDIDO
  ====================================== */

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const orderId =
          Number(id);

        if (
          Number.isNaN(orderId)
        ) {
          throw new Error(
            'Pedido inválido.'
          );
        }

        const data =
          await getOrderById(
            orderId
          );

        if (isMounted) {
          setOrder(data);
        }
      } catch (error) {
        console.error(
          'Error cargando detalle:',
          error
        );

        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No se pudo cargar el pedido.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);


  /* =====================================
     ESTADO
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
     MÉTODO DE PAGO
  ====================================== */

  const getPaymentText = (
    method: string
  ) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';

      case 'transfer':
        return 'Transferencia';

      case 'card':
        return 'Tarjeta';

      default:
        return method;
    }
  };


  /* =====================================
     FECHA
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
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };


  /* =====================================
     CANCELAR
  ====================================== */

  const handleCancel = async () => {
    if (!order) {
      return;
    }

    if (
      order.status !==
      'pending'
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
      setCancelling(true);
      setError('');

      const updated =
        await cancelOrder(
          order.id
        );

      setOrder(updated);
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
      setCancelling(false);
    }
  };


  /* =====================================
     CARGANDO
  ====================================== */

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className="order-detail-message">
            Cargando pedido...
          </div>
        </IonContent>
      </IonPage>
    );
  }


  /* =====================================
     ERROR
  ====================================== */

  if (
    error &&
    !order
  ) {
    return (
      <IonPage>
        <IonContent fullscreen>

          <div className="order-detail-page">

            <header className="order-detail-header">

              <button
                type="button"
                className="order-detail-back"
                onClick={() =>
                  history.push(
                    '/pedidos'
                  )
                }
              >
                <IonIcon
                  icon={
                    arrowBackOutline
                  }
                />
              </button>

              <div>
                <h1>
                  Detalle del pedido
                </h1>
              </div>

            </header>

            <div className="order-detail-message error">
              {error}
            </div>

          </div>

        </IonContent>
      </IonPage>
    );
  }


  if (!order) {
    return null;
  }


  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="order-detail-page">

          {/* =====================================
              HEADER
          ====================================== */}

          <header className="order-detail-header">

            <button
              type="button"
              className="order-detail-back"
              onClick={(event) => {
                event.currentTarget.blur();

                history.push(
                  '/pedidos'
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
              <h1>
                Pedido #{order.id}
              </h1>

              <span>
                {formatDate(
                  order.created_at
                )}
              </span>
            </div>

          </header>


          {/* =====================================
              RESUMEN
          ====================================== */}

          <section className="order-detail-summary">

            <div>
              <span>
                Total del pedido
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

            <span
              className={
                `order-detail-status status-${order.status}`
              }
            >
              {getStatusText(
                order.status
              )}
            </span>

          </section>


          {/* =====================================
              SEGUIMIENTO
          ====================================== */}

          <section className="order-tracking">

            <h2>
              Seguimiento del pedido
            </h2>

            {order.status ===
            'cancelled' ? (

              <div className="tracking-cancelled">
                Pedido cancelado
              </div>

            ) : (

              <div className="tracking-steps">

                {[
                  {
                    key: 'pending',
                    label: 'Pendiente',
                  },
                  {
                    key: 'confirmed',
                    label: 'Confirmado',
                  },
                  {
                    key: 'preparing',
                    label: 'Preparando',
                  },
                  {
                    key: 'on_the_way',
                    label: 'En camino',
                  },
                  {
                    key: 'delivered',
                    label: 'Entregado',
                  },
                ].map(
                  (
                    step,
                    index,
                    steps
                  ) => {
                    const orderStatuses =
                      [
                        'pending',
                        'confirmed',
                        'preparing',
                        'on_the_way',
                        'delivered',
                      ];

                    const currentIndex =
                      orderStatuses.indexOf(
                        order.status
                      );

                    const completed =
                      index <=
                      currentIndex;

                    return (
                      <div
                        className="tracking-step-wrapper"
                        key={
                          step.key
                        }
                      >

                        <div
                          className={
                            `tracking-step ${
                              completed
                                ? 'completed'
                                : ''
                            }`
                          }
                        >

                          <div className="tracking-dot">
                            {index + 1}
                          </div>

                          <span>
                            {step.label}
                          </span>

                        </div>

                        {index <
                          steps.length -
                            1 && (
                          <div
                            className={
                              `tracking-line ${
                                index <
                                currentIndex
                                  ? 'completed'
                                  : ''
                              }`
                            }
                          />
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>


          {/* =====================================
              DIRECCIÓN
          ====================================== */}

          <section className="order-detail-section">

            <div className="order-detail-title">

              <IonIcon
                icon={
                  locationOutline
                }
              />

              <div>
                <h2>
                  Dirección de entrega
                </h2>

                <span>
                  Información del pedido
                </span>
              </div>

            </div>

            <div className="order-detail-address">

              <strong>
                {order.customer_name}
              </strong>

              <span>
                {order.sector}
              </span>

              <span>
                {order.address}
              </span>

              {order.reference && (
                <small>
                  Referencia:{' '}
                  {order.reference}
                </small>
              )}

            </div>

          </section>


          {/* =====================================
              CONTACTO
          ====================================== */}

          <section className="order-detail-section">

            <div className="order-detail-title">

              <IonIcon
                icon={callOutline}
              />

              <div>
                <h2>
                  Contacto
                </h2>

                <span>
                  Teléfono de contacto
                </span>
              </div>

            </div>

            <div className="order-detail-address">
              <strong>
                {order.phone}
              </strong>
            </div>

          </section>


          {/* =====================================
              PAGO
          ====================================== */}

          <section className="order-detail-section">

            <div className="order-detail-title">

              <IonIcon
                icon={cardOutline}
              />

              <div>
                <h2>
                  Método de pago
                </h2>

                <span>
                  Forma de pago seleccionada
                </span>
              </div>

            </div>

            <strong className="payment-name">
              {getPaymentText(
                order.payment_method
              )}
            </strong>

          </section>


          {/* =====================================
              PRODUCTOS
          ====================================== */}

          <section className="order-detail-section">

            <div className="order-detail-title">

              <IonIcon
                icon={
                  receiptOutline
                }
              />

              <div>
                <h2>
                  Productos
                </h2>

                <span>
                  Productos incluidos
                  en tu pedido
                </span>
              </div>

            </div>

            {order.items &&
            order.items.length >
              0 ? (

              <div className="order-detail-products">

                {order.items.map(
                  (item) => (
                    <div
                      className="order-detail-product"
                      key={item.id}
                    >

                      <div>
                        <strong>
                          {item.product_name}
                        </strong>

                        <span>
                          {item.quantity}{' '}
                          × RD${' '}
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

              </div>

            ) : (
              <p className="order-detail-no-products">
                No hay productos
                disponibles.
              </p>
            )}

          </section>


          {/* =====================================
              TOTAL
          ====================================== */}

          <section className="order-detail-total">

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                RD${' '}
                {Number(
                  order.subtotal
                ).toLocaleString(
                  'es-DO'
                )}
              </strong>
            </div>

            <div>
              <span>
                Delivery
              </span>

              <strong>
                RD${' '}
                {Number(
                  order.delivery_fee
                ).toLocaleString(
                  'es-DO'
                )}
              </strong>
            </div>

            <div className="order-detail-grand-total">

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

          </section>


          {/* =====================================
              CANCELAR
              SOLO CLIENTE / PENDIENTE
          ====================================== */}

          {order.status ===
            'pending' && (

            <section className="order-cancel-section">

              <div className="order-cancel-info">

                <IonIcon
                  icon={timeOutline}
                />

                <div>
                  <strong>
                    ¿Deseas cancelar?
                  </strong>

                  <span>
                    Solo puedes cancelar
                    mientras el pedido
                    esté pendiente.
                  </span>
                </div>

              </div>

              <button
                type="button"
                className="cancel-order-button"
                onClick={
                  handleCancel
                }
                disabled={
                  cancelling
                }
              >
                {cancelling
                  ? 'Cancelando...'
                  : 'Cancelar pedido'}
              </button>

            </section>
          )}


          {error && (
            <div className="cancel-order-error">
              {error}
            </div>
          )}

        </div>

      </IonContent>
    </IonPage>
  );
}


export default OrderDetailPage;