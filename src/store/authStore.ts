import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/src/utils/types';

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  (set) => ({
    user: null,
    profile: null,
    loading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    clearAuth: () => set({ user: null, profile: null, loading: false }),
  })
);
