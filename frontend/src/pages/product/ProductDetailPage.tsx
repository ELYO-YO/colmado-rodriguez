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
  addOutline,
  cartOutline,
} from 'ionicons/icons';

import {
  getProducts,
} from '../../services/productService';

import type {
  Product,
} from '../../components/ProductCard/ProductCard';

import { useCart } from '../../context/CartContext';

import './ProductDetailPage.css';


interface RouteParams {
  id: string;
}


function ProductDetailPage() {
  const history = useHistory();

  const { id } = useParams<RouteParams>();

  const {
    addToCart,
    cartCount,
  } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  useEffect(() => {
    getProducts()
      .then((products) => {
        const foundProduct =
          products.find(
            (item) =>
              item.id === Number(id)
          );

        if (!foundProduct) {
          setError(
            'Producto no encontrado.'
          );

          return;
        }

        setProduct(foundProduct);
      })
      .catch((error) => {
        console.error(
          'Error cargando producto:',
          error
        );

        setError(
          'No se pudo cargar el producto.'
        );
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);


  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>

          <div className="product-not-found">
            <p>
              Cargando producto...
            </p>
          </div>

        </IonContent>
      </IonPage>
    );
  }


  if (error || !product) {
    return (
      <IonPage>
        <IonContent fullscreen>

          <div className="product-not-found">

            <h2>
              Producto no encontrado
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={() =>
                history.push('/')
              }
            >
              Volver al inicio
            </button>

          </div>

        </IonContent>
      </IonPage>
    );
  }


  const hasOffer =
    product.is_offer &&
    product.old_price &&
    product.old_price >
      product.price;


  return (
    <IonPage>
      <IonContent fullscreen>

        <div className="product-detail">

          {/* Header */}
          <header className="detail-header">

            <button
              className="back-button"
              onClick={() =>
                history.goBack()
              }
              aria-label="Volver"
            >
              <IonIcon
                icon={arrowBackOutline}
              />
            </button>

            <h1>
              Detalle del producto
            </h1>

            <button
              className="detail-cart"
              onClick={() =>
                history.push('/')
              }
              aria-label="Ver carrito"
            >
              <IonIcon
                icon={cartOutline}
              />

              <span>
                {cartCount}
              </span>
            </button>

          </header>


          {/* Imagen */}
          <div className="detail-image">

            {hasOffer && (

              <span className="detail-offer-badge">

                {product.discount_percentage
                  ? `-${product.discount_percentage}%`
                  : 'OFERTA'}

              </span>

            )}

            <img
              src={product.image}
              alt={product.name}
            />

          </div>


          {/* Información */}
          <div className="detail-info">

            <span className="detail-category">

              {product.category?.name ??
                'Producto del Colmado'}

            </span>

            <h2>
              {product.name}
            </h2>

            <p className="detail-description">
              {product.description}
            </p>


            {/* Precio */}
            <div className="detail-price-container">

              {hasOffer && (

                <span className="detail-old-price">

                  RD${' '}

                  {Number(
                    product.old_price
                  ).toLocaleString(
                    'es-DO'
                  )}

                </span>

              )}

              <strong className="detail-price">

                RD${' '}

                {Number(
                  product.price
                ).toLocaleString(
                  'es-DO'
                )}

              </strong>

              {hasOffer && (

                <span className="detail-saving">

                  Ahorras RD${' '}

                  {Number(
                    Number(
                      product.old_price
                    ) -
                    product.price
                  ).toLocaleString(
                    'es-DO'
                  )}

                </span>

              )}

            </div>


            {/* Cantidad */}
            <div className="quantity-selector">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                  )
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (current) =>
                      current + 1
                  )
                }
              >
                +
              </button>

            </div>


            {/* Agregar */}
            <button
              type="button"
              className="add-to-cart-detail"
              onClick={() => {

                addToCart(
                  product,
                  quantity
                );

                setQuantity(1);
              }}
            >

              <IonIcon
                icon={addOutline}
              />

              Agregar al carrito

            </button>

          </div>

        </div>

      </IonContent>
    </IonPage>
  );
}


export default ProductDetailPage;