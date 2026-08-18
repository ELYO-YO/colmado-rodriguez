import { apiFetch } from './apiClient';

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: Category | null;
  available: boolean;
  is_offer: boolean;
  discount_percentage: number;
  old_price: string | null;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: string;
  image: string;
  category_id: number | null;
  available: boolean;
  is_offer: boolean;
  discount_percentage: number;
  old_price: string | null;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  category_id?: number | null;
  available?: boolean;
  is_offer?: boolean;
  discount_percentage?: number;
  old_price?: string | null;
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await apiFetch(
    `${API_URL}/products/${id}/`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para eliminar productos.'
      );
    }

    throw new Error(
      'No se pudo eliminar el producto.'
    );
  }
}

const API_URL = 'http://127.0.0.1:8000/api';

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch(
    `${API_URL}/categories/`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      'No se pudieron cargar las categorías.'
    );
  }

  return data;
}

export async function createProduct(
  product: CreateProductRequest
): Promise<AdminProduct> {
  const response = await apiFetch(
    `${API_URL}/products/`,
    {
      method: 'POST',
      body: JSON.stringify(product),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error(
      'Error creando producto:',
      data
    );

    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para agregar productos.'
      );
    }

    throw new Error(
      data?.detail ??
        'No se pudo agregar el producto.'
    );
  }

  return data;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const response = await apiFetch(
    `${API_URL}/products/`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      'No se pudieron cargar los productos.'
    );
  }

  return data;
}

export async function updateProduct(
  id: number,
  product: Partial<CreateProductRequest>
): Promise<AdminProduct> {
  const response = await apiFetch(
    `${API_URL}/products/${id}/`,
    {
      method: 'PATCH',
      body: JSON.stringify(product),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para modificar productos.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo actualizar el producto.'
    );
  }

  return data;
}

export async function getAdminProductById(
  id: number
): Promise<AdminProduct> {
  const response = await apiFetch(
    `${API_URL}/products/${id}/`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Producto no encontrado.');
    }

    throw new Error(
      'No se pudo cargar el producto.'
    );
  }

  return data;
}

export async function updateAdminProduct(
  id: number,
  product: Partial<CreateProductRequest>
): Promise<AdminProduct> {
  const response = await apiFetch(
    `${API_URL}/products/${id}/`,
    {
      method: 'PATCH',
      body: JSON.stringify(product),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para editar productos.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo actualizar el producto.'
    );
  }

  return data;
}

export interface CreateCategoryRequest {
  name: string;
  image: string;
}

export async function createCategory(
  category: CreateCategoryRequest
): Promise<Category> {
  const response = await apiFetch(
    `${API_URL}/categories/`,
    {
      method: 'POST',
      body: JSON.stringify(category),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para crear categorías.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo crear la categoría.'
    );
  }

  return data;
}

export async function updateCategory(
  id: number,
  category: Partial<CreateCategoryRequest>
): Promise<Category> {
  const response = await apiFetch(
    `${API_URL}/categories/${id}/`,
    {
      method: 'PATCH',
      body: JSON.stringify(category),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para editar categorías.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo actualizar la categoría.'
    );
  }

  return data;
}

export async function deleteCategory(
  id: number
): Promise<void> {
  const response = await apiFetch(
    `${API_URL}/categories/${id}/`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para eliminar categorías.'
      );
    }

    throw new Error(
      'No se pudo eliminar la categoría.'
    );
  }
}