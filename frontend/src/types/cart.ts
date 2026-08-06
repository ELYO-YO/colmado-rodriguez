import type { Product } from '../components/ProductCard/ProductCard';

export interface CartItem extends Product {
  quantity: number;
}