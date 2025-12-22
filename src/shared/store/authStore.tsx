import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localStorageHelper } from '../lib/localStorage';

// Minimal user type - loyihaga moslashtirish kerak
export interface IUser {
  id: number;
  name: string;
  email?: string;
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  login: (user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user: IUser) => {
        set({ isAuthenticated: true, user });
        localStorageHelper.set('access_token', user.access_token);
        localStorageHelper.set('refresh_token', user.refresh_token);
      },
      logout: () => {
        localStorageHelper.remove('access_token');
        localStorageHelper.remove('refresh_token');
        set({ isAuthenticated: false, user: null });
      },
      updateUser: (user: IUser) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
