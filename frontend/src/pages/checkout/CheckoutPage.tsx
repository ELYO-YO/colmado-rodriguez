import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  locationOutline,
  callOutline,
  personOutline,
  cashOutline,
} from 'ionicons/icons';

import { useCart } from '../../context/CartContext';

import './CheckoutPage.css';

function CheckoutPage() {
  const history = useHistory();

  const {
  cartItems,
  cartTotal,
  clearCart,
} = useCart();

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="checkout-page">

          {/* Encabezado */}

          <header className="checkout-header">

            <button
              className="checkout-back"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <div>
              <h1>Confirmar pedido</h1>
              <span>Completa tus datos de entrega</span>
            </div>

          </header>

          {/* Datos del cliente */}

          <section className="checkout-section">

            <div className="checkout-section-title">
              <IonIcon icon={personOutline} />

              <div>
                <h2>Datos de entrega</h2>
                <span>¿Dónde te llevamos tu pedido?</span>
              </div>
            </div>

            <div className="checkout-form">

              <label>
                Nombre completo

                <div className="checkout-input">
                  <IonIcon icon={personOutline} />

                  <input
                    type="text"
                    placeholder="Ej: Pedro Pérez"
                  />
                </div>
              </label>

              <label>
                Teléfono

                <div className="checkout-input">
                  <IonIcon icon={callOutline} />

                  <input
                    type="tel"
                    placeholder="Ej: 809-555-5555"
                  />
                </div>
              </label>

              <label>
                Sector

                <div className="checkout-input">
                  <IonIcon icon={locationOutline} />

                  <input
                    type="text"
                    placeholder="Ej: Fantino"
                  />
                </div>
              </label>

              <label>
                Dirección

                <div className="checkout-input">
                  <IonIcon icon={locationOutline} />

                  <input
                    type="text"
                    placeholder="Calle, número de casa..."
                  />
                </div>
              </label>

              <label>
                Referencia

                <textarea
                  placeholder="Ej: Casa blanca frente al colmado..."
                  rows={3}
                />

              </label>

            </div>

          </section>

          {/* Método de pago */}

          <section className="checkout-section">

            <div className="checkout-section-title">
              <IonIcon icon={cashOutline} />

              <div>
                <h2>Método de pago</h2>
                <span>Selecciona cómo vas a pagar</span>
              </div>
            </div>

            <div className="payment-options">

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="efectivo"
                  defaultChecked
                />

                <div>
                  <strong>Efectivo</strong>
                  <span>Pago al recibir</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="transferencia"
                />

                <div>
                  <strong>Transferencia</strong>
                  <span>Pago mediante transferencia</span>
                </div>
              </label>

            </div>

          </section>

          {/* Resumen */}

          <section className="checkout-section">

            <div className="checkout-section-title">
              <div>
                <h2>Resumen del pedido</h2>
                <span>
                  {cartItems.length} producto
                  {cartItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="checkout-products">

              {cartItems.map((item) => (

                <div
                  className="checkout-product"
                  key={item.id}
                >

                  <div className="checkout-product-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="checkout-product-info">
                    <strong>{item.name}</strong>

                    <span>
                      {item.quantity} × RD${' '}
                      {item.price.toLocaleString('es-DO')}
                    </span>
                  </div>

                  <strong>
                    RD${' '}
                    {(item.price * item.quantity)
                      .toLocaleString('es-DO')}
                  </strong>

                </div>

              ))}

            </div>

            <div className="checkout-total">

              <div>
                <span>Subtotal</span>
                <strong>
                  RD$ {cartTotal.toLocaleString('es-DO')}
                </strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>Por calcular</strong>
              </div>

              <div className="checkout-grand-total">
                <span>Total</span>

                <strong>
                  RD$ {cartTotal.toLocaleString('es-DO')}
                </strong>
              </div>

            </div>

          </section>

          {/* Confirmar */}

          <button
  className="confirm-order-button"
  onClick={() => {
    clearCart();
    history.push('/pedido-realizado');
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