export interface Category {
  id: number;
  name: string;
  image: string;
}

const API_URL = 'http://127.0.0.1:8000/api/categories/';

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }

  return response.json();
}