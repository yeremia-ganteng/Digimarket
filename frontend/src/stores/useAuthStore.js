import { create } from 'zustand';
import api from '../services/api';

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/login', credentials);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login gagal. Periksa email/password.';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage, { cause: err });
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/register', userData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registrasi gagal.';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage, { cause: err });
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch {
      // Abaikan error jika token kadaluarsa
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));