import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        set((state) => {
          const isCurrentlyInWishlist = state.wishlistIds.includes(productId);
          if (isCurrentlyInWishlist) {
            return {
              wishlistIds: state.wishlistIds.filter((id) => id !== productId),
            };
          } else {
            return {
              wishlistIds: [...state.wishlistIds, productId],
            };
          }
        });
      },
      isInWishlist: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },
    }),
    {
      name: 'luxora-wishlist-storage', // name of the item in the storage (must be unique)
    }
  )
);
