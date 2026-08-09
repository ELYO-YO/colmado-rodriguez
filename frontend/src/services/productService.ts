import type { Product } from '../components/ProductCard/ProductCard';

const API_URL = 'http://127.0.0.1:8000/api/products/';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  const data = await response.json();

  return data.map((product: any) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image || '/images/products/default.jpg',
  }));
}