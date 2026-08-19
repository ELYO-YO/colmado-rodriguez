const API_BASE_URL = 'http://127.0.0.1:8000';

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/token/refresh/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.access) {
      console.error('No se pudo renovar el token:', data);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');

      return null;
    }

    localStorage.setItem(
      'accessToken',
      data.access
    );

    return data.access;
  } catch (error) {
    console.error(
      'Error renovando token:',
      error
    );

    return null;
  }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let accessToken =
    localStorage.getItem('accessToken');

  const headers = new Headers(
    options.headers
  );

  if (
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  if (accessToken) {
    headers.set(
      'Authorization',
      `Bearer ${accessToken}`
    );
  }

  let response = await fetch(
    url,
    {
      ...options,
      headers,
    }
  );

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken =
    await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  headers.set(
    'Authorization',
    `Bearer ${newAccessToken}`
  );

  response = await fetch(
    url,
    {
      ...options,
      headers,
    }
  );

  return response;
}

export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
}