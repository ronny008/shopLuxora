import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  id: string; // unique id combining productId and size
  product: Product;
  quantity: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product: Product, quantity = 1, size?: string) => {
        set((state) => {
          const cartItemId = size ? `${product._id}-${size}` : product._id;
          const existingItem = state.items.find((item) => item.id === cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === cartItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { id: cartItemId, product, quantity, size }] };
        });
      },
      removeFromCart: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'luxora-cart-storage', // unique name for localStorage
    }
  )
);
