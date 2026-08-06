import type { Product } from '../components/ProductCard/ProductCard';

export const products: Product[] = [
  {
    id: 1,
    name: 'Arroz Premium',
    description: 'Arroz selecto 5 lb',
    price: 250,
    image: '/images/products/arroz.jpg',
  },
  {
    id: 2,
    name: 'Coca-Cola',
    description: 'Refresco 2 litros',
    price: 125,
    image: '/images/products/coca-cola.jpg',
  },
  {
    id: 3,
    name: 'Leche Entera',
    description: 'Leche entera 1 litro',
    price: 95,
    image: '/images/products/leche.jpg',
  },
  {
    id: 4,
    name: 'Pan de Agua',
    description: 'Pan fresco del día',
    price: 75,
    image: '/images/products/pan.jpg',
  },
];