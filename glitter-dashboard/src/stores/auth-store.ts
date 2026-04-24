/**
 * Global auth state using Zustand.
 *
 * Stores the currently logged-in user and hydration state.
 * Tokens themselves live in localStorage (see token-storage.ts), not here.
 */
import { create } from 'zustand';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  isHydrated: boolean; // true once we've tried to load the user on startup
  setUser: (user: User | null) => void;
  setHydrated: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: (value) => set({ isHydrated: value }),
  clear: () => set({ user: null }),
}));