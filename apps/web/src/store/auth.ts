import { create } from 'zustand';
import type { User } from '@hommiespace/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('hs_cust_user') || 'null'),
  token: localStorage.getItem('hs_cust_token'),
  isAuthenticated: !!localStorage.getItem('hs_cust_token'),

  setAuth: (user, token) => {
    localStorage.setItem('hs_cust_token', token);
    localStorage.setItem('hs_cust_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('hs_cust_token');
    localStorage.removeItem('hs_cust_user');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
