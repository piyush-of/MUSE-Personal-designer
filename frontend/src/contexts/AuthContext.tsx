import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse } from '../types';
import { apiFetch, setAccessToken } from '../services/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch<{ success: boolean; user: User | null }>('/api/auth/me');
      setUser(res.user);
      if (res.user) localStorage.setItem('muse-user', JSON.stringify(res.user));
      else localStorage.removeItem('muse-user');
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('muse-user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.accessToken) setAccessToken(res.accessToken);
    setUser(res.user || null);
    if (res.user) localStorage.setItem('muse-user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.accessToken) setAccessToken(res.accessToken);
    setUser(res.user || null);
    if (res.user) localStorage.setItem('muse-user', JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('muse-user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
