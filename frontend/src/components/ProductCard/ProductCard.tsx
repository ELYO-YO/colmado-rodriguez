import { IonIcon } from '@ionic/react';

import {
  addOutline,
} from 'ionicons/icons';

import './ProductCard.css';

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;

  category?: ProductCategory | null;

  is_offer?: boolean;
  discount_percentage?: number;
  old_price?: number | null;
}

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick?: () => void;
}

function ProductCard({
  product,
  onAdd,
  onClick,
}: ProductCardProps) {
  const hasOffer =
    product.is_offer &&
    product.old_price &&
    product.old_price > product.price;

  const handleAdd = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    onAdd(product);
  };

  return (
    <article
      className="product-card"
      onClick={onClick}
    >

      <div className="product-image">

        {hasOffer && (
          <span className="product-offer-badge">
            {product.discount_percentage
              ? `-${product.discount_percentage}%`
              : 'OFERTA'}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

      </div>

      <div className="product-info">

        <div className="product-text">

          <strong className="product-name">
            {product.name}
          </strong>

          <span className="product-description">
            {product.description}
          </span>

        </div>

        <div className="product-footer">

          <div className="product-price">

            {hasOffer && (
              <span className="product-old-price">
                RD${' '}
                {Number(
                  product.old_price
                ).toLocaleString('es-DO')}
              </span>
            )}

            <strong>
              RD${' '}
              {Number(
                product.price
              ).toLocaleString('es-DO')}
            </strong>

          </div>

          <button
            type="button"
            className="add-button"
            onClick={handleAdd}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <IonIcon icon={addOutline} />
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;