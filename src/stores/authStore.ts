import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

// Demo users for all roles
const DEMO_USERS: Record<string, User & { password: string }> = {
  'admin@goldlink.ph': {
    id: '1',
    email: 'admin@goldlink.ph',
    name: 'Carlos Reyes',
    role: 'admin',
    password: 'admin123',
  },
  'hr@goldlink.ph': {
    id: '2',
    email: 'hr@goldlink.ph',
    name: 'Maria Santos',
    role: 'hr',
    password: 'hr123',
  },
  'supervisor@goldlink.ph': {
    id: '3',
    email: 'supervisor@goldlink.ph',
    name: 'Juan Dela Cruz',
    role: 'supervisor',
    password: 'super123',
  },
  'employee@goldlink.ph': {
    id: '4',
    email: 'employee@goldlink.ph',
    name: 'Ana Reyes',
    role: 'employee',
    password: 'emp123',
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (email: string, password: string): boolean => {
    const demoUser = DEMO_USERS[email];
    if (demoUser && demoUser.password === password) {
      const { password: _, ...user } = demoUser;
      void _;
      set({
        user,
        token: `demo-jwt-${user.id}`,
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  setRole: (role: UserRole) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, role } };
    });
  },
}));
