import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CompareState {
  compareProducts: Product[];
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      compareProducts: [],
      toggleCompare: (product: Product) => {
        set((state) => {
          const isCurrentlyInCompare = state.compareProducts.some(
            (p) => p._id === product._id
          );
          
          if (isCurrentlyInCompare) {
            return {
              compareProducts: state.compareProducts.filter((p) => p._id !== product._id),
            };
          } else {
            // Limit to max 4 products for comparison
            if (state.compareProducts.length >= 4) {
              return state;
            }
            return {
              compareProducts: [...state.compareProducts, product],
            };
          }
        });
      },
      removeFromCompare: (productId: string) => {
        set((state) => ({
          compareProducts: state.compareProducts.filter((p) => p._id !== productId),
        }));
      },
      clearCompare: () => {
        set({ compareProducts: [] });
      },
    }),
    {
      name: 'luxora-compare-storage', // name of the item in the storage
    }
  )
);
