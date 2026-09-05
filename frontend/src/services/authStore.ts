import { create } from 'zustand';
import { User } from '../types';
import { api } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const TOKEN_KEY = 'nutrivision_token';
const USER_KEY = 'nutrivision_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isLoading: true,
  error: null,

  setAuth: (user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true, error: null, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false, error: null, isLoading: false });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const authData = res.data?.data;
      if (authData?.accessToken && authData?.user) {
        const rawUser = authData.user;
        const primaryRole = (rawUser.roles && rawUser.roles.length > 0)
          ? (rawUser.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER')
          : 'ROLE_USER';

        const mappedUser: User = {
          userId: rawUser.userId,
          email: rawUser.email,
          fullName: rawUser.fullName,
          role: primaryRole,
          dietaryPreference: rawUser.profile?.dietaryPreference || 'ANY',
          preferredLanguage: rawUser.profile?.preferredLanguage || 'en',
          city: rawUser.profile?.city || '',
        };

        get().setAuth(mappedUser, authData.accessToken);
      } else {
        throw new Error('Invalid authentication response format from server.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please verify credentials.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (fullName: string, email: string, password: string, confirmPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
        disclaimerAccepted: true,
      });

      const authData = res.data?.data;
      if (authData?.accessToken && authData?.user) {
        const rawUser = authData.user;
        const mappedUser: User = {
          userId: rawUser.userId,
          email: rawUser.email,
          fullName: rawUser.fullName,
          role: 'ROLE_USER',
          dietaryPreference: 'ANY',
          preferredLanguage: 'en',
          city: '',
        };

        get().setAuth(mappedUser, authData.accessToken);
      } else {
        throw new Error('Registration completed but token was not returned.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please check inputs.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Stateless token removal does not strictly depend on server response
    } finally {
      get().clearAuth();
    }
  },

  restoreSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await api.get('/auth/me');
      const rawUser = res.data?.data;
      if (rawUser) {
        const primaryRole = (rawUser.roles && rawUser.roles.length > 0)
          ? (rawUser.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER')
          : 'ROLE_USER';

        const mappedUser: User = {
          userId: rawUser.userId,
          email: rawUser.email,
          fullName: rawUser.fullName,
          role: primaryRole,
          dietaryPreference: rawUser.profile?.dietaryPreference || 'ANY',
          preferredLanguage: rawUser.profile?.preferredLanguage || 'en',
          city: rawUser.profile?.city || '',
        };

        set({ user: mappedUser, token, isAuthenticated: true, isLoading: false, error: null });
        localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      } else {
        get().clearAuth();
      }
    } catch (err) {
      console.warn('Session restoration failed or token expired. Clearing session.');
      get().clearAuth();
    }
  },

  updateUser: (updatedUser: Partial<User>) => {
    const current = get().user;
    if (current) {
      const merged = { ...current, ...updatedUser };
      set({ user: merged });
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
    }
  },
}));
