import { create } from 'zustand';
import type { Product } from '@hommiespace/shared';

export interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  wishlist: Product[];
  addItem: (product: Product, variantId?: string, variantName?: string, qty?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: JSON.parse(localStorage.getItem('hs_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('hs_wishlist') || '[]'),

  addItem: (product, variantId, variantName, qty = 1) => {
    set((state) => {
      const existingIdx = state.items.findIndex(
        (item) => item.product.id === product.id && item.variantId === variantId
      );

      let newItems = [...state.items];
      if (existingIdx > -1) {
        newItems[existingIdx].qty += qty;
      } else {
        newItems.push({ product, variantId, variantName, qty });
      }

      localStorage.setItem('hs_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productId, variantId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => !(item.product.id === productId && item.variantId === variantId)
      );
      localStorage.setItem('hs_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQty: (productId, qty, variantId) => {
    set((state) => {
      const newItems = state.items.map((item) =>
        item.product.id === productId && item.variantId === variantId
          ? { ...item, qty: Math.max(1, qty) }
          : item
      );
      localStorage.setItem('hs_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('hs_cart');
    set({ items: [] });
  },

  toggleWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.some((item) => item.id === product.id);
      let newWishlist;
      if (exists) {
        newWishlist = state.wishlist.filter((item) => item.id !== product.id);
      } else {
        newWishlist = [...state.wishlist, product];
      }
      localStorage.setItem('hs_wishlist', JSON.stringify(newWishlist));
      return { wishlist: newWishlist };
    });
  }
}));
