const API_URL = 'http://127.0.0.1:8000/api/auth/login/';

interface LoginResponse {
  access: string;
  refresh: string;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  return response.json();
}