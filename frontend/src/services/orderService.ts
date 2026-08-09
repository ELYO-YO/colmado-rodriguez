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

const API_URL = 'http://127.0.0.1:8000/api/orders/';

export async function createOrder(
  order: CreateOrderRequest
): Promise<CreatedOrder> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    console.error('Error del backend:', errorData);

    throw new Error('No se pudo registrar el pedido.');
  }

  return response.json();
}