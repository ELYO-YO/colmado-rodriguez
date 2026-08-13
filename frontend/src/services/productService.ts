import type {
  Product,
} from '../components/ProductCard/ProductCard';

const API_URL =
  'http://127.0.0.1:8000/api/products/';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      'No se pudieron cargar los productos'
    );
  }

  const data = await response.json();

  return data.map((product: any): Product => ({
    id: product.id,

    name: product.name,

    description:
      product.description ?? '',

    price: Number(product.price),

    image:
      product.image ||
      '/images/products/default.jpg',

    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : null,

    is_offer:
      Boolean(product.is_offer),

    discount_percentage:
      Number(
        product.discount_percentage ?? 0
      ),

    old_price:
      product.old_price !== null &&
      product.old_price !== undefined
        ? Number(product.old_price)
        : null,
  }));
}