import { create } from 'zustand';
import type { User, Vendor } from '@hommiespace/shared';

const defaultSuperAdmin: User = {
  id: 'super-admin-01',
  name: 'Super Administrator',
  email: 'admin@hommiespace.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

let storedUser: User | null = null;
try {
  const parsed = JSON.parse(localStorage.getItem('hs_user') || 'null');
  if (parsed && parsed.role === 'admin') {
    storedUser = parsed;
  }
} catch (e) {}

const initialUser = storedUser || defaultSuperAdmin;
const initialToken = localStorage.getItem('hs_token') || 'admin-secret-token-2026';

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
  user: initialUser,
  vendor: JSON.parse(localStorage.getItem('hs_vendor') || 'null'),
  token: initialToken,
  isAuthenticated: true,

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
