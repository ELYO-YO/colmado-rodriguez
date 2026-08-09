import { useState } from 'react';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  locationOutline,
  cardOutline,
  cashOutline,
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

import { useCart } from '../../context/CartContext';

import './CheckoutPage.css';

function CheckoutPage() {
  const history = useHistory();

  const {
  cartItems,
  cartTotal,
  clearCart,
} = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>(
    'cash'
  );

  const deliveryFee = 100;
  const total = cartTotal + deliveryFee;

  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="checkout-container">

          {/* Encabezado */}
          <header className="checkout-header">

            <button
              type="button"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <h1>Finalizar pedido</h1>

          </header>

          {/* Dirección */}
          <section className="checkout-section">

            <div className="checkout-section-title">

              <IonIcon icon={locationOutline} />

              <div>
                <h2>Dirección de entrega</h2>
                <p>¿Dónde entregamos tu pedido?</p>
              </div>

            </div>

            <input
              type="text"
              placeholder="Ej. Calle Principal #10"
            />

            <input
              type="text"
              placeholder="Sector o barrio"
            />

          </section>

          {/* Método de pago */}
          <section className="checkout-section">

            <div className="checkout-section-title">

              <IonIcon icon={cardOutline} />

              <div>
                <h2>Método de pago</h2>
                <p>Selecciona cómo deseas pagar</p>
              </div>

            </div>

            <div className="payment-options">

              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === 'cash' ? 'active' : ''
                }`}
                onClick={() => setPaymentMethod('cash')}
              >

                <IonIcon icon={cashOutline} />

                <div>
                  <strong>Efectivo</strong>
                  <span>Pago al recibir</span>
                </div>

              </button>

              <button
                type="button"
                className={`payment-option ${
                  paymentMethod === 'card' ? 'active' : ''
                }`}
                onClick={() => setPaymentMethod('card')}
              >

                <IonIcon icon={cardOutline} />

                <div>
                  <strong>Tarjeta</strong>
                  <span>Pago electrónico</span>
                </div>

              </button>

            </div>

          </section>

          {/* Resumen */}
          <section className="checkout-section">

            <div className="checkout-section-title">

              <div>
                <h2>Resumen del pedido</h2>
                <p>
                  {cartItems.length} producto
                  {cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>

            </div>

            <div className="checkout-items">

              {cartItems.map((item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="checkout-item-info">

                    <strong>{item.name}</strong>

                    <span>
                      {item.quantity} x RD${' '}
                      {item.price.toLocaleString('es-DO')}
                    </span>

                  </div>

                  <strong>
                    RD${' '}
                    {(item.price * item.quantity).toLocaleString('es-DO')}
                  </strong>

                </div>

              ))}

            </div>

          </section>

          {/* Totales */}
          <section className="checkout-total">

            <div>
              <span>Subtotal</span>

              <strong>
                RD$ {cartTotal.toLocaleString('es-DO')}
              </strong>
            </div>

            <div>
              <span>Delivery</span>

              <strong>
                RD$ {deliveryFee.toLocaleString('es-DO')}
              </strong>
            </div>

            <div className="checkout-grand-total">

              <span>Total</span>

              <strong>
                RD$ {total.toLocaleString('es-DO')}
              </strong>

            </div>

          </section>

          {/* Confirmar */}
<button
  className="confirm-order-button"
  type="button"
  onClick={() => {
    alert('¡Pedido confirmado! Gracias por comprar en Colmado Rodríguez.');
    clearCart();
    history.push('/');
  }}
>
  Confirmar pedido
</button>

        </div>

      </IonContent>

    </IonPage>
  );
}

export default CheckoutPage;