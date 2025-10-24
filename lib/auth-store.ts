// import { create } from 'zustand';

// interface AuthState {
//   isAuthenticated: boolean;
//   login: (token: string, refreshToken: string) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
//   login: (token, refreshToken) => {
//     localStorage.setItem('accessToken', token);
//     localStorage.setItem('refreshToken', refreshToken);
//     set({ isAuthenticated: true });
//   },
//   logout: () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     set({ isAuthenticated: false });
//   },
// })); 

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Tokens = {
  access: string | null;
  refresh: string | null;
};

type AuthState = Tokens & {
  isRefreshing: boolean;
  login: (access: string, refresh: string) => void;
  setTokens: (tokens: Tokens) => void;
  logout: () => void;
  getAccess: () => string | null;
  getRefresh: () => string | null;
  markRefreshing: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      isRefreshing: false,

      login: (access, refresh) => set({ access, refresh }),
      setTokens: ({ access, refresh }) => set({ access, refresh }),
      logout: () => set({ access: null, refresh: null }),

      getAccess: () => get().access,
      getRefresh: () => get().refresh,
      markRefreshing: (v: boolean) => set({ isRefreshing: v }),
    }),
    {
      name: "auth", // localStorage key
      partialize: (s) => ({ access: s.access, refresh: s.refresh }),
    }
  )
);
