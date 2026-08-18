import { apiFetch } from './apiClient';

export interface DashboardStats {
  total_revenue: string;
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  preparing_orders: number;
  on_the_way_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_products: number;
  active_offers: number;
}

const API_URL = 'http://127.0.0.1:8000/api/dashboard/stats/';

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiFetch(API_URL);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (response.status === 403) {
      throw new Error('No tienes permiso para acceder al dashboard.');
    }

    throw new Error(
      data?.detail ?? 'No se pudieron cargar las estadísticas.'
    );
  }

  return data;
}