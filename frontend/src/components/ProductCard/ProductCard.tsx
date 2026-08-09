import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import type { MouseEvent } from 'react';

import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: {
    id: number;
    name: string;
    image: string;
  };
  available: boolean;
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
  return (
    <article
      className="product-card"
      onClick={onClick}
    >
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-info">
        <span className="product-name">
          {product.name}
        </span>

        <span className="product-description">
          {product.description}
        </span>

        <div className="product-footer">
          <strong>
            RD$ {product.price.toLocaleString('es-DO')}
          </strong>

          <button
            className="add-button"
            aria-label={`Agregar ${product.name}`}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              onAdd(product);
            }}
          >
            <IonIcon icon={addOutline} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;