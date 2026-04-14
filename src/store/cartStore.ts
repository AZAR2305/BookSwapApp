import { create } from 'zustand';
import type { BookListing, CartItem } from '@/src/utils/types';

interface CartStore {
  items: CartItem[];
  addToCart: (book: BookListing) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (book) => {
    const existing = get().items.find((item) => item.book.id === book.id);
    if (existing) {
      set({
        items: get().items.map((item) =>
          item.book.id === book.id ? { ...item, qty: item.qty + 1 } : item
        ),
      });
      return;
    }

    set({ items: [...get().items, { book, qty: 1 }] });
  },
  removeFromCart: (bookId) =>
    set({ items: get().items.filter((item) => item.book.id !== bookId) }),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.book.price * item.qty, 0),
}));
