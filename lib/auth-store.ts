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
      markRefreshing: (v) => set({ isRefreshing: v }),
    }),
    {
      name: "auth",
      partialize: (s) => ({ access: s.access, refresh: s.refresh }),
    }
  )
);
