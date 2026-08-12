import { useState, type FormEvent } from 'react';
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
import { createOrder } from '../../services/orderService';

import './CheckoutPage.css';

type PaymentMethod = 'cash' | 'transfer';

function CheckoutPage() {
  const history = useHistory();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Tu carrito está vacío.');
      return;
    }

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !sector.trim() ||
      !address.trim()
    ) {
      setFormError('Completa todos los campos obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);

      const createdOrder = await createOrder({
  customer_name: customerName.trim(),
  phone: phone.trim(),
  sector: sector.trim(),
  address: address.trim(),
  reference: reference.trim(),
  payment_method: paymentMethod,
  items: cartItems.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  })),
});

clearCart();

history.push(
  `/pedido-realizado/${createdOrder.id}`
);
    } catch (error) {
      console.error(error);

      setFormError(
        'No pudimos registrar el pedido. Verifica que Django esté encendido.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <form
          className="checkout-page"
          onSubmit={handleSubmit}
        >
          {/* Encabezado */}
          <header className="checkout-header">
            <button
              type="button"
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
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    required
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
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    required
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
                    value={sector}
                    onChange={(event) =>
                      setSector(event.target.value)
                    }
                    required
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
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    required
                  />
                </div>
              </label>

              <label>
                Referencia

                <textarea
                  placeholder="Ej: Casa blanca frente al colmado..."
                  rows={3}
                  value={reference}
                  onChange={(event) =>
                    setReference(event.target.value)
                  }
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
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
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
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={() =>
                    setPaymentMethod('transfer')
                  }
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
                <strong>RD$ 100</strong>
              </div>

              <div className="checkout-grand-total">
                <span>Total</span>

                <strong>
                  RD${' '}
                  {(cartTotal + 100).toLocaleString('es-DO')}
                </strong>
              </div>
            </div>
          </section>

          {formError && (
            <p className="checkout-error">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="confirm-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Registrando pedido...'
              : 'Confirmar pedido'}
          </button>
        </form>
      </IonContent>
    </IonPage>
  );
}

export default CheckoutPage;