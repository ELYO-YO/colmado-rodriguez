import { IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
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
            onClick={() => onAdd(product)}
            aria-label={`Agregar ${product.name}`}
          >
            <IonIcon icon={addOutline} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;