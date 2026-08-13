import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password: string, role?: 'Customer' | 'Admin') => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  checkAuth: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      set({ user: data.user || null, isInitialized: true, isLoading: false });
    } catch {
      set({ user: null, isInitialized: true, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || 'Login failed';
        set({ error: errorMsg, isLoading: false });
        return { success: false, error: errorMsg };
      }

      set({ user: data.user, isInitialized: true, isLoading: false, error: null });
      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (name: string, email: string, password: string, role = 'Customer') => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || 'Registration failed';
        set({ error: errorMsg, isLoading: false });
        return { success: false, error: errorMsg };
      }

      set({ user: data.user, isInitialized: true, isLoading: false, error: null });
      return { success: true, user: data.user };
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, isLoading: false, error: null });
    }
  },
}));
