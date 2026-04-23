import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initGitHub } from '../lib/github';

interface AuthState {
  token: string | null;
  user: {
    login: string;
    avatar_url: string;
  } | null;
  setToken: (token: string) => void;
  setUser: (user: { login: string; avatar_url: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        initGitHub(token);
        set({ token });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null });
        sessionStorage.clear();
      },
    }),
    {
      name: 'github-manager-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          initGitHub(state.token);
        }
      },
    }
  )
);
