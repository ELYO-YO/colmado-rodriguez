import { apiFetch } from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const API_URL = 'http://127.0.0.1:8000/api/auth';

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  return data;
}

export async function registerUser(
  userData: RegisterRequest
): Promise<RegisteredUser> {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error registrando usuario:', data);

    if (data?.username) {
      throw new Error('Ese nombre de usuario ya está registrado.');
    }

    if (data?.email) {
      throw new Error('Ese correo electrónico no es válido.');
    }

    if (data?.password_confirm) {
      throw new Error(data.password_confirm[0]);
    }

    throw new Error('No se pudo crear la cuenta.');
  }

  return data;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await apiFetch(`${API_URL}/profile/`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    throw new Error('No se pudo cargar el perfil.');
  }

  return response.json();
}

export async function updateProfile(
  userData: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await apiFetch(`${API_URL}/profile/`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('Error actualizando perfil:', data);

    if (response.status === 401) {
      throw new Error('Tu sesión ha expirado.');
    }

    if (data?.username) {
      throw new Error('Ese nombre de usuario ya está en uso.');
    }

    throw new Error('No se pudo actualizar el perfil.');
  }

  return data;
}

export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
}