import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IProduct } from '../api/services/home';

interface FavoritesState {
  favorites: IProduct[];
  toggleFavorite: (product: IProduct) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product: IProduct) => {
        const { favorites } = get();
        if (favorites.some(p => p.id === product.id)) {
          set({ favorites: favorites.filter(p => p.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
