import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
  id: string;
  name?: string;
  email?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: IUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: (user: IUser, accessToken: string, refreshToken: string) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
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
