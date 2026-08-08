import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/react';

import {
  arrowBackOutline,
  addOutline,
  cartOutline,
} from 'ionicons/icons';

import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

import './ProductDetailPage.css';

interface RouteParams {
  id: string;
}

function ProductDetailPage() {
  const history = useHistory();
  const { id } = useParams<RouteParams>();

  const { addToCart, cartCount } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <IonPage>
        <IonContent>
          <div className="product-not-found">
            <h2>Producto no encontrado</h2>

            <button onClick={() => history.push('/home')}>
              Volver al inicio
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="product-detail">

          {/* Encabezado */}
          <header className="detail-header">

            <button
              className="back-button"
              onClick={() => history.goBack()}
              aria-label="Volver"
            >
              <IonIcon icon={arrowBackOutline} />
            </button>

            <h1>Detalle del producto</h1>

            <button
              className="detail-cart"
              onClick={() => history.push('/')}
              aria-label="Ver carrito"
            >
              <IonIcon icon={cartOutline} />
              <span>{cartCount}</span>
            </button>

          </header>

          {/* Imagen */}
          <div className="detail-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Información */}
          <div className="detail-info">

            <span className="detail-category">
              Producto del Colmado
            </span>

            <h2>{product.name}</h2>

            <p className="detail-description">
              {product.description}
            </p>

            <strong className="detail-price">
              RD$ {product.price.toLocaleString('es-DO')}
            </strong>

            {/* Comprar */}
            <div className="quantity-selector">

            <button
             onClick={() =>
            setQuantity((current) => Math.max(1, current - 1))
            }
            >
            −
           </button>

           <span>{quantity}</span>

  <button
    onClick={() =>
      setQuantity((current) => current + 1)
    }
  >
    +
  </button>

</div>

   <button
    className="add-to-cart-detail"
    onClick={() => {
    addToCart(product, quantity);
    setQuantity(1);
  }}
>
  <IonIcon icon={addOutline} />
  Agregar al carrito
</button>

          </div>

        </div>

      </IonContent>
    </IonPage>
  );
}

export default ProductDetailPage;