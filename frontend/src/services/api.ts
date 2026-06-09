import { getCsrfToken } from '../utils/cookies';

const API_BASE = import.meta.env.VITE_API_URL || '';

let accessToken = localStorage.getItem('muse-token') || '';

export function setAccessToken(token: string | null) {
  accessToken = token || '';
  if (token) localStorage.setItem('muse-token', token);
  else localStorage.removeItem('muse-token');
}

export function getAccessToken() {
  return accessToken;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken(),
      },
    });
    if (!res.ok) return false;
    const body = await res.json();
    if (body.success && body.accessToken) {
      setAccessToken(body.accessToken);
      if (body.user) localStorage.setItem('muse-user', JSON.stringify(body.user));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && retry && !path.includes('/auth/')) {
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(path, options, false);
    setAccessToken(null);
    localStorage.removeItem('muse-user');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0] || 'Request failed');
  }
  return data as T;
}
