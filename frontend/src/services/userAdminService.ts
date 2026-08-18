import { apiFetch } from './apiClient';

export type UserRole =
  | 'admin'
  | 'employee'
  | 'customer';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: UserRole;
}

const API_URL =
  'http://127.0.0.1:8000/api/auth/users/';

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiFetch(API_URL);

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para gestionar usuarios.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudieron cargar los usuarios.'
    );
  }

  return data;
}

export async function updateUserRole(
  id: number,
  role: 'customer' | 'employee'
): Promise<AdminUser> {
  const response = await apiFetch(
    `${API_URL}${id}/role/`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        role,
      }),
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para cambiar roles.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo cambiar el rol.'
    );
  }

  return data;
}

export async function updateUserActive(
  id: number,
  isActive: boolean
): Promise<AdminUser> {
  const response = await apiFetch(
    `${API_URL}${id}/active/`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        is_active: isActive,
      }),
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión ha expirado.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'No tienes permiso para modificar usuarios.'
      );
    }

    throw new Error(
      data?.detail ??
      'No se pudo actualizar el usuario.'
    );
  }

  return data;
}