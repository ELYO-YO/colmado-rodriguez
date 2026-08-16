const AUTH_URL = 'http://127.0.0.1:8000/api/auth';

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) return null;

  try {
    const response = await fetch(`${AUTH_URL}/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      clearSession();
      return null;
    }

    const data = await response.json();

    if (!data?.access) {
      clearSession();
      return null;
    }

    localStorage.setItem('accessToken', data.access);

    return data.access;
  } catch (error) {
    console.error('Error renovando token:', error);
    clearSession();
    return null;
  }
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let accessToken = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  accessToken = await refreshAccessToken();

  if (!accessToken) {
    return response;
  }

  headers.set('Authorization', `Bearer ${accessToken}`);

  response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
  }

  return response;
}