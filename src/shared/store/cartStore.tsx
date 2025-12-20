import BagTickIcon from '@/assets/svg/bag-tick.svg?react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IProduct } from '../api/services/home';
import { openNotification } from '../lib/notification';

export interface CartItem {
  product: IProduct;
  quantity: number;
  checked: boolean;
}

interface CartState {
  items: CartItem[];

  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
  toggleItemCheck: (productId: number) => void;
  toggleAllChecks: (checked: boolean) => void;
  getCheckedItems: () => CartItem[];
  getCheckedItemsCount: () => number;
  areAllItemsChecked: () => boolean;
  removeCheckedItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: IProduct, quantity = 1) => {
        const { items } = get();
        const safeQuantity = Math.max(1, quantity); // Kamida 1 bo'lishini ta'minlash
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + safeQuantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { product, quantity: safeQuantity, checked: false },
            ],
          });
        }

        openNotification({
          title: "Mahsulot savatchaga qo'shildi!",
          icon: <BagTickIcon />,
          type: 'success',
        });
      },

      removeFromCart: (productId: number) => {
        const { items } = get();
        set({
          items: items.filter(item => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set({
          items: items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.product.discount_price || item.product.price || 0;
          return total + price * item.quantity;
        }, 0);
      },

      isInCart: (productId: number) => {
        const { items } = get();
        return items.some(item => item.product.id === productId);
      },

      getItemQuantity: (productId: number) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      toggleItemCheck: (productId: number) => {
        const { items } = get();
        set({
          items: items.map(item =>
            item.product.id === productId
              ? { ...item, checked: !item.checked }
              : item
          ),
        });
      },

      toggleAllChecks: (checked: boolean) => {
        const { items } = get();
        set({
          items: items.map(item => ({ ...item, checked })),
        });
      },

      getCheckedItems: () => {
        const { items } = get();
        return items.filter(item => item.checked);
      },

      getCheckedItemsCount: () => {
        const { items } = get();
        return items.filter(item => item.checked).length;
      },

      areAllItemsChecked: () => {
        const { items } = get();
        if (items.length === 0) return false;
        return items.every(item => item.checked);
      },

      removeCheckedItems: () => {
        const { items } = get();
        set({
          items: items.filter(item => !item.checked),
        });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
