import { apiFetch } from './apiClient';

interface OrderItemRequest {
  product_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customer_name: string;
  phone: string;
  sector: string;
  address: string;
  reference: string;
  payment_method: 'cash' | 'transfer';
  items: OrderItemRequest[];
}

export interface CreatedOrder {
  id: number;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  sector: string;
  address: string;
  reference: string;
  payment_method: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

const API_URL = 'http://127.0.0.1:8000/api/orders/';

export async function createOrder(
  order: CreateOrderRequest
): Promise<CreatedOrder> {
  const response = await apiFetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(order),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error creando pedido:', data);

    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
    }

    throw new Error(data?.detail ?? 'No se pudo registrar el pedido.');
  }

  return data;
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiFetch(API_URL);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error cargando pedidos:', data);

    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    throw new Error('No se pudieron cargar los pedidos.');
  }

  return data;
}

export async function getOrderById(id: number): Promise<Order> {
  const response = await apiFetch(`${API_URL}${id}/`);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error cargando pedido:', data);

    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 404) {
      throw new Error('Pedido no encontrado.');
    }

    throw new Error('No se pudo cargar el pedido.');
  }

  return data;
}

export async function cancelOrder(id: number): Promise<Order> {
  const response = await apiFetch(`${API_URL}${id}/cancel/`, {
    method: 'POST',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error cancelando pedido:', data);

    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 404) {
      throw new Error('Pedido no encontrado.');
    }

    throw new Error(data?.detail ?? 'No se pudo cancelar el pedido.');
  }

  return data;
}

export async function updateOrderStatus(id: number): Promise<Order> {
  const response = await apiFetch(`${API_URL}${id}/status/`, {
    method: 'PATCH',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error('No tienes permiso para actualizar pedidos.');
    }

    throw new Error(
      data?.detail ?? 'No se pudo actualizar el estado del pedido.'
    );
  }

  return data;
}