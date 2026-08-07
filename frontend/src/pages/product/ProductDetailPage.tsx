import { useState } from 'react';

import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  addOutline,
  removeOutline,
  cartOutline,
} from 'ionicons/icons';

import { useHistory, useParams } from 'react-router-dom';

import { products } from '../../data/products';

import './ProductDetailPage.css';

interface RouteParams {
  id: string;
}

function ProductDetailPage() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <div className="product-not-found">

            <h2>Producto no encontrado</h2>

            <p>
              Este producto no está disponible.
            </p>

            <button
              onClick={() => history.goBack()}
            >
              Volver
            </button>

          </div>
        </IonContent>
      </IonPage>
    );
  }

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const total = product.price * quantity;

  return (
    <IonPage>

      <IonContent fullscreen>

        <div className="product-detail">

          {/* Header */}
          <header className="product-detail-header">

            <button
              className="back-button"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <button
              className="detail-cart-button"
              onClick={() => history.push('/')}
              aria-label="Abrir carrito"
            >
              <IonIcon icon={cartOutline} />
            </button>

          </header>

          {/* Imagen */}
          <div className="product-detail-image">

            <img
              src={product.image}
              alt={product.name}
            />

          </div>

          {/* Información */}
          <div className="product-detail-info">

            <span className="product-detail-category">
              Producto del colmado
            </span>

            <h1>{product.name}</h1>

            <strong className="product-detail-price">
              RD$ {product.price.toLocaleString('es-DO')}
            </strong>

            <p className="product-detail-description">
              {product.description}
            </p>

            {/* Cantidad */}
            <div className="quantity-section">

              <span>Cantidad</span>

              <div className="quantity-selector">

                <button
                  onClick={decreaseQuantity}
                  aria-label="Disminuir cantidad"
                >
                  <IonIcon icon={removeOutline} />
                </button>

                <strong>{quantity}</strong>

                <button
                  onClick={increaseQuantity}
                  aria-label="Aumentar cantidad"
                >
                  <IonIcon icon={addOutline} />
                </button>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="product-detail-footer">

            <div className="detail-total">

              <span>Total</span>

              <strong>
                RD$ {total.toLocaleString('es-DO')}
              </strong>

            </div>

            <button
              className="add-to-cart-detail"
              onClick={() => {
                console.log(
                  'Agregar al carrito:',
                  product,
                  'Cantidad:',
                  quantity
                );
              }}
            >
              <IonIcon icon={cartOutline} />

              Agregar al carrito
            </button>

          </div>

        </div>

      </IonContent>

    </IonPage>
  );
}

export default ProductDetailPage;