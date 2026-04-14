import { create } from 'zustand';

interface WishlistStore {
  ids: string[];
  toggleWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: [],
  toggleWishlist: (bookId) => {
    const ids = get().ids;
    set({
      ids: ids.includes(bookId) ? ids.filter((id) => id !== bookId) : [...ids, bookId],
    });
  },
  isInWishlist: (bookId) => get().ids.includes(bookId),
}));
