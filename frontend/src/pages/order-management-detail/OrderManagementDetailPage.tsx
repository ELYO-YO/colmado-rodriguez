import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  arrowBackOutline,
  callOutline,
  cardOutline,
  checkmarkCircleOutline,
  locationOutline,
  personOutline,
  receiptOutline,
  timeOutline,
} from 'ionicons/icons';

import {
  getOrderById,
  updateOrderStatus,
  type Order,
} from '../../services/orderService';

import {
  getProfile,
  type UserProfile,
} from '../../services/authService';

import './OrderManagementDetailPage.css';

interface RouteParams {
  id: string;
}

function OrderManagementDetailPage() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();

  const [order, setOrder] = useState<Order | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        const userProfile = await getProfile();

        if (
          userProfile.role !== 'admin' &&
          userProfile.role !== 'employee'
        ) {
          history.replace('/');
          return;
        }

        setProfile(userProfile);

        const orderId = Number(id);

        if (Number.isNaN(orderId)) {
          setError('Pedido inválido.');
          return;
        }

        const data = await getOrderById(orderId);

        setOrder(data);
        setError('');
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el pedido.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [id, history]);

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
        return 'Confirmar pedido';
      case 'confirmed':
        return 'Marcar como preparando';
      case 'preparing':
        return 'Marcar como en camino';
      case 'on_the_way':
        return 'Marcar como entregado';
      default:
        return '';
    }
  };

  const getPaymentText = (paymentMethod: string) => {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-DO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      setUpdateError('');

      const updatedOrder = await updateOrderStatus(order.id);

      setOrder(updatedOrder);
    } catch (error) {
      console.error(error);

      setUpdateError(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el pedido.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const canUpdate =
    order &&
    order.status !== 'delivered' &&
    order.status !== 'cancelled';

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="management-detail-page">
          <header className="management-detail-header">
            <button
              type="button"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <div>
              <span>
                {profile?.role === 'admin'
                  ? 'Panel administrador'
                  : 'Panel empleado'}
              </span>

              <h1>Pedido #{order?.id ?? id}</h1>
            </div>
          </header>

          {loading ? (
            <div className="management-detail-message">
              Cargando pedido...
            </div>
          ) : error ? (
            <div className="management-detail-message error">
              {error}
            </div>
          ) : order ? (
            <>
              <section className="management-detail-hero">
                <div>
                  <span>Estado actual</span>

                  <strong>
                    {getStatusText(order.status)}
                  </strong>

                  <small>
                    {formatDate(order.created_at)}
                  </small>
                </div>

                <div
                  className={`management-detail-status status-${order.status}`}
                >
                  <IonIcon icon={timeOutline} />
                  {getStatusText(order.status)}
                </div>
              </section>

              {canUpdate && (
                <section className="management-detail-action">
                  <div>
                    <strong>Actualizar pedido</strong>
                    <span>
                      Cambia el estado según avance la preparación.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updating}
                  >
                    <IonIcon icon={checkmarkCircleOutline} />

                    {updating
                      ? 'Actualizando...'
                      : getNextStatusText(order.status)}
                  </button>

                  {updateError && (
                    <p>{updateError}</p>
                  )}
                </section>
              )}

              <div className="management-detail-grid">
                <section className="management-detail-card">
                  <div className="management-card-title">
                    <IonIcon icon={personOutline} />

                    <div>
                      <h2>Cliente</h2>
                      <span>Datos de contacto</span>
                    </div>
                  </div>

                  <div className="management-info-list">
                    <div>
                      <strong>{order.customer_name}</strong>
                    </div>

                    <div>
                      <IonIcon icon={callOutline} />
                      <span>{order.phone}</span>
                    </div>

                    <div>
                      <IonIcon icon={locationOutline} />
                      <span>
                        {order.sector}, {order.address}
                      </span>
                    </div>

                    {order.reference && (
                      <small>
                        Referencia: {order.reference}
                      </small>
                    )}
                  </div>
                </section>

                <section className="management-detail-card">
                  <div className="management-card-title">
                    <IonIcon icon={cardOutline} />

                    <div>
                      <h2>Pago</h2>
                      <span>Método seleccionado</span>
                    </div>
                  </div>

                  <strong className="management-payment">
                    {getPaymentText(order.payment_method)}
                  </strong>
                </section>
              </div>

              <section className="management-detail-card">
                <div className="management-card-title">
                  <IonIcon icon={receiptOutline} />

                  <div>
                    <h2>Productos</h2>
                    <span>
                      {order.items?.length ?? 0} productos
                    </span>
                  </div>
                </div>

                <div className="management-products">
                  {(order.items ?? []).map((item) => (
                    <div
                      className="management-product"
                      key={item.id}
                    >
                      <div>
                        <strong>{item.product_name}</strong>

                        <span>
                          {item.quantity} × RD${' '}
                          {Number(
                            item.unit_price
                          ).toLocaleString('es-DO')}
                        </span>
                      </div>

                      <strong>
                        RD${' '}
                        {Number(
                          item.subtotal
                        ).toLocaleString('es-DO')}
                      </strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="management-total-card">
                <div>
                  <span>Subtotal</span>

                  <strong>
                    RD${' '}
                    {Number(
                      order.subtotal
                    ).toLocaleString('es-DO')}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>

                  <strong>
                    RD${' '}
                    {Number(
                      order.delivery_fee
                    ).toLocaleString('es-DO')}
                  </strong>
                </div>

                <div className="management-grand-total">
                  <span>Total</span>

                  <strong>
                    RD${' '}
                    {Number(
                      order.total
                    ).toLocaleString('es-DO')}
                  </strong>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default OrderManagementDetailPage;