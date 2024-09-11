import { create } from 'zustand';

interface UserState {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
