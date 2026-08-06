import { IonIcon } from '@ionic/react';
import {
  addOutline,
  removeOutline,
  trashOutline,
  closeOutline,
} from 'ionicons/icons';

import type { CartItem } from '../../types/cart';

import './Cart.css';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

function Cart({
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProps) {

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-overlay">

      <aside className="cart-panel">

        <div className="cart-header">
          <div>
            <h2>Tu carrito</h2>
            <span>
              {items.length} producto{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        {items.length === 0 ? (

          <div className="cart-empty">
            <IonIcon icon={trashOutline} />

            <h3>Tu carrito está vacío</h3>

            <p>
              Agrega algunos productos del colmado
              para comenzar tu pedido.
            </p>
          </div>

        ) : (

          <div className="cart-items">

            {items.map((item) => (

              <div className="cart-item" key={item.id}>

                <div className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item-info">

                  <strong>{item.name}</strong>

                  <span>
                    RD$ {item.price.toLocaleString('es-DO')}
                  </span>

                  <div className="quantity-controls">

                    <button
                      onClick={() => onDecrease(item.id)}
                      aria-label="Disminuir cantidad"
                    >
                      <IonIcon icon={removeOutline} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => onIncrease(item.id)}
                      aria-label="Aumentar cantidad"
                    >
                      <IonIcon icon={addOutline} />
                    </button>

                  </div>

                </div>

                <button
                  className="remove-item"
                  onClick={() => onRemove(item.id)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  <IonIcon icon={trashOutline} />
                </button>

              </div>

            ))}

          </div>
        )}

        {items.length > 0 && (

          <div className="cart-footer">

            <div className="cart-total">
              <span>Total</span>

              <strong>
                RD$ {total.toLocaleString('es-DO')}
              </strong>
            </div>

            <button className="checkout-button">
              Continuar pedido
            </button>

          </div>

        )}

      </aside>

    </div>
  );
}

export default Cart;