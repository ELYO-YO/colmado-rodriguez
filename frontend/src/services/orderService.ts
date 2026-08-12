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

/* =========================================
   CREAR PEDIDO
========================================= */

export async function createOrder(
  order: CreateOrderRequest
): Promise<CreatedOrder> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error(
      'Debes iniciar sesión para realizar un pedido.'
    );
  }

  const response = await fetch(API_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    console.error(
      'Error creando pedido:',
      errorData
    );

    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado. Inicia sesión nuevamente.'
      );
    }

    throw new Error(
      'No se pudo registrar el pedido.'
    );
  }

  return response.json();
}

/* =========================================
   OBTENER MIS PEDIDOS
========================================= */

export async function getOrders(): Promise<Order[]> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error(
      'Debes iniciar sesión.'
    );
  }

  const response = await fetch(API_URL, {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    console.error(
      'Error cargando pedidos:',
      errorData
    );

    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    throw new Error(
      'No se pudieron cargar los pedidos.'
    );
  }

  return response.json();
}

/* =========================================
   OBTENER PEDIDO POR ID
========================================= */

export async function getOrderById(
  id: number
): Promise<Order> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error(
      'Debes iniciar sesión.'
    );
  }

  const response = await fetch(
    `${API_URL}${id}/`,
    {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    console.error(
      'Error cargando pedido:',
      errorData
    );

    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 404) {
      throw new Error(
        'Pedido no encontrado.'
      );
    }

    throw new Error(
      'No se pudo cargar el pedido.'
    );
  }

  return response.json();
}

/* =========================================
   CANCELAR PEDIDO
========================================= */

export async function cancelOrder(
  id: number
): Promise<Order> {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error(
      'Debes iniciar sesión.'
    );
  }

  const response = await fetch(
    `${API_URL}${id}/cancel/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    console.error(
      'Error cancelando pedido:',
      data
    );

    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 404) {
      throw new Error(
        'Pedido no encontrado.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo cancelar el pedido.'
    );
  }

  return data;
}