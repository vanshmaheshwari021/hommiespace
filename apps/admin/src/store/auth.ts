import { create } from 'zustand';
import type { User, Vendor } from '@hommiespace/shared';

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, vendor?: Vendor | null) => void;
  updateVendor: (vendor: Vendor) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('hs_user') || 'null'),
  vendor: JSON.parse(localStorage.getItem('hs_vendor') || 'null'),
  token: localStorage.getItem('hs_token'),
  isAuthenticated: !!localStorage.getItem('hs_token'),
  
  setAuth: (user, token, vendor = null) => {
    localStorage.setItem('hs_token', token);
    localStorage.setItem('hs_user', JSON.stringify(user));
    if (vendor) {
      localStorage.setItem('hs_vendor', JSON.stringify(vendor));
    } else {
      localStorage.removeItem('hs_vendor');
    }
    set({ user, token, vendor, isAuthenticated: true });
  },

  updateVendor: (vendor) => {
    localStorage.setItem('hs_vendor', JSON.stringify(vendor));
    set({ vendor });
  },

  logout: () => {
    localStorage.removeItem('hs_token');
    localStorage.removeItem('hs_user');
    localStorage.removeItem('hs_vendor');
    set({ user: null, vendor: null, token: null, isAuthenticated: false });
  }
}));
