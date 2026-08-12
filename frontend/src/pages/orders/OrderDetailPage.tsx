import { useEffect, useState } from 'react';

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
  locationOutline,
  cardOutline,
  receiptOutline,
  timeOutline,
  checkmarkCircleOutline,
  bicycleOutline,
  closeCircleOutline,
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

  const { id } = useParams<RouteParams>();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [cancelError, setCancelError] =
    useState('');

  useEffect(() => {
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      setError('Pedido inválido.');
      setLoading(false);
      return;
    }

    getOrderById(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((error) => {
        console.error(error);

        if (
          error instanceof Error &&
          error.message.includes('sesión')
        ) {
          history.replace('/login');
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el pedido.'
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id, history]);

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

  const getPaymentText = (
    paymentMethod: string
  ) => {
    switch (paymentMethod) {

      case 'cash':
        return 'Efectivo';

      case 'transfer':
        return 'Transferencia';

      case 'card':
        return 'Tarjeta';

      default:
        return paymentMethod;
    }
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(date).toLocaleString(
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

  const handleCancelOrder = async () => {
    if (!order) {
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que deseas cancelar el pedido #${order.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setCancelError('');

      const updatedOrder =
        await cancelOrder(order.id);

      setOrder(updatedOrder);

    } catch (error) {
      console.error(
        'Error cancelando pedido:',
        error
      );

      setCancelError(
        error instanceof Error
          ? error.message
          : 'No se pudo cancelar el pedido.'
      );

    } finally {
      setIsCancelling(false);
    }
  };

  const trackingSteps = [
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
  ];

  const statusOrder = [
    'pending',
    'confirmed',
    'preparing',
    'on_the_way',
    'delivered',
  ];

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="order-detail-page">

          {/* =============================
              HEADER
          ============================== */}

          <header className="order-detail-header">

            <button
              className="order-detail-back"
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
                Detalle del pedido
              </h1>

              <span>
                Información de tu compra
              </span>

            </div>

          </header>

          {/* =============================
              CARGANDO
          ============================== */}

          {loading ? (

            <div className="order-detail-message">
              Cargando pedido...
            </div>

          ) : error ? (

            /* =============================
                ERROR
            ============================== */

            <div className="order-detail-message error">
              {error}
            </div>

          ) : order ? (

            <>

              {/* =============================
                  RESUMEN
              ============================== */}

              <section className="order-detail-summary">

                <div>

                  <span>
                    Pedido
                  </span>

                  <strong>
                    #{order.id}
                  </strong>

                </div>

                <div
                  className={`order-detail-status status-${order.status}`}
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

              </section>

              <span className="order-detail-date">
                {formatDate(
                  order.created_at
                )}
              </span>

              {/* =============================
                  SEGUIMIENTO
              ============================== */}

              <section className="order-tracking">

                <h2>
                  Seguimiento del pedido
                </h2>

                <div className="tracking-steps">

                  {trackingSteps.map(
                    (
                      step,
                      index
                    ) => {

                      const currentIndex =
                        statusOrder.indexOf(
                          order.status
                        );

                      const stepIndex =
                        statusOrder.indexOf(
                          step.key
                        );

                      const completed =
                        order.status !==
                          'cancelled' &&
                        stepIndex <=
                          currentIndex;

                      const lineCompleted =
                        order.status !==
                          'cancelled' &&
                        stepIndex <
                          currentIndex;

                      return (
                        <div
                          className="tracking-step-wrapper"
                          key={step.key}
                        >

                          <div
                            className={`tracking-step ${
                              completed
                                ? 'completed'
                                : ''
                            }`}
                          >

                            <div className="tracking-dot">

                              {completed
                                ? '✓'
                                : index + 1}

                            </div>

                            <span>
                              {step.label}
                            </span>

                          </div>

                          {index <
                            trackingSteps.length -
                              1 && (

                            <div
                              className={`tracking-line ${
                                lineCompleted
                                  ? 'completed'
                                  : ''
                              }`}
                            />

                          )}

                        </div>
                      );
                    }
                  )}

                </div>

                {order.status ===
                  'cancelled' && (

                  <div className="tracking-cancelled">

                    <IonIcon
                      icon={
                        closeCircleOutline
                      }
                    />

                    <span>
                      Este pedido fue
                      cancelado.
                    </span>

                  </div>

                )}

              </section>

              {/* =============================
                  DIRECCIÓN
              ============================== */}

              <section className="order-detail-section">

                <div className="order-detail-title">

                  <IonIcon
                    icon={locationOutline}
                  />

                  <div>

                    <h2>
                      Dirección de entrega
                    </h2>

                    <span>
                      Datos registrados
                    </span>

                  </div>

                </div>

                <div className="order-detail-address">

                  <strong>
                    {order.customer_name}
                  </strong>

                  <span>
                    {order.phone}
                  </span>

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

              {/* =============================
                  MÉTODO DE PAGO
              ============================== */}

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
                      Forma seleccionada
                    </span>

                  </div>

                </div>

                <strong className="payment-name">

                  {getPaymentText(
                    order.payment_method
                  )}

                </strong>

              </section>

              {/* =============================
                  PRODUCTOS
              ============================== */}

              <section className="order-detail-section">

                <div className="order-detail-title">

                  <IonIcon
                    icon={receiptOutline}
                  />

                  <div>

                    <h2>
                      Productos
                    </h2>

                    <span>

                      {order.items?.length ??
                        0}{' '}

                      producto

                      {(order.items?.length ??
                        0) !== 1
                        ? 's'
                        : ''}

                    </span>

                  </div>

                </div>

                <div className="order-detail-products">

                  {(order.items ?? []).map(
                    (item) => (

                      <div
                        className="order-detail-product"
                        key={item.id}
                      >

                        <div>

                          <strong>
                            {
                              item.product_name
                            }
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

                  {(order.items?.length ??
                    0) === 0 && (

                    <p className="order-detail-no-products">

                      No hay productos
                      registrados en este
                      pedido.

                    </p>

                  )}

                </div>

              </section>

              {/* =============================
                  TOTALES
              ============================== */}

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

              {/* =============================
                  CANCELAR PEDIDO
              ============================== */}

              {order.status ===
                'pending' && (

                <section className="order-cancel-section">

                  <div className="order-cancel-info">

                    <IonIcon
                      icon={
                        closeCircleOutline
                      }
                    />

                    <div>

                      <strong>
                        ¿Ya no necesitas
                        este pedido?
                      </strong>

                      <span>
                        Puedes cancelarlo
                        mientras todavía
                        esté pendiente.
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="cancel-order-button"
                    onClick={
                      handleCancelOrder
                    }
                    disabled={
                      isCancelling
                    }
                  >

                    {isCancelling
                      ? 'Cancelando...'
                      : 'Cancelar pedido'}

                  </button>

                  {cancelError && (

                    <span className="cancel-order-error">

                      {cancelError}

                    </span>

                  )}

                </section>

              )}

            </>

          ) : null}

        </div>

      </IonContent>
    </IonPage>
  );
}

export default OrderDetailPage;