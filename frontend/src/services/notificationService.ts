import { apiFetch } from './apiClient';

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const API_URL = 'http://127.0.0.1:8000/api/notifications/';

export async function getNotifications(): Promise<Notification[]> {
  const response = await apiFetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las notificaciones.');
  }

  return response.json();
}

export async function markNotificationAsRead(
  id: number
): Promise<Notification> {
  const response = await apiFetch(`${API_URL}${id}/read/`, {
    method: 'PATCH',
    body: JSON.stringify({
      is_read: true,
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la notificación.');
  }

  return response.json();
}