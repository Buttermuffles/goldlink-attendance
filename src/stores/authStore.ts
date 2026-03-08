import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { toast } from '@/stores/toastStore';

// ─── Permissions Matrix ────────────────────────────────────────
export type Permission =
  | 'employees:read' | 'employees:create' | 'employees:update' | 'employees:delete'
  | 'attendance:read' | 'attendance:create' | 'attendance:update' | 'attendance:delete'
  | 'leaves:read' | 'leaves:create' | 'leaves:approve' | 'leaves:delete'
  | 'payroll:read' | 'payroll:create' | 'payroll:update' | 'payroll:finalize'
  | 'worksites:read' | 'worksites:create' | 'worksites:update' | 'worksites:delete'
  | 'reports:read' | 'settings:read' | 'settings:update';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'employees:read', 'employees:create', 'employees:update', 'employees:delete',
    'attendance:read', 'attendance:create', 'attendance:update', 'attendance:delete',
    'leaves:read', 'leaves:create', 'leaves:approve', 'leaves:delete',
    'payroll:read', 'payroll:create', 'payroll:update', 'payroll:finalize',
    'worksites:read', 'worksites:create', 'worksites:update', 'worksites:delete',
    'reports:read', 'settings:read', 'settings:update',
  ],
  hr: [
    'employees:read', 'employees:create', 'employees:update',
    'attendance:read', 'attendance:create', 'attendance:update',
    'leaves:read', 'leaves:create', 'leaves:approve',
    'payroll:read', 'payroll:create', 'payroll:update', 'payroll:finalize',
    'worksites:read',
    'reports:read', 'settings:read',
  ],
  supervisor: [
    'employees:read',
    'attendance:read', 'attendance:create', 'attendance:update',
    'leaves:read', 'leaves:approve',
    'payroll:read',
    'worksites:read',
    'reports:read', 'settings:read',
  ],
  employee: [
    'employees:read',
    'attendance:read', 'attendance:create',
    'leaves:read', 'leaves:create',
    'payroll:read',
    'settings:read',
  ],
};

// ─── Route Access Matrix ────────────────────────────────────────
export const ROUTE_ROLES: Record<string, UserRole[]> = {
  '/': ['admin', 'hr', 'supervisor', 'employee'],
  '/employees': ['admin', 'hr', 'supervisor', 'employee'],
  '/attendance': ['admin', 'hr', 'supervisor', 'employee'],
  '/map': ['admin', 'hr', 'supervisor', 'employee'],
  '/payroll': ['admin', 'hr', 'supervisor', 'employee'],
  '/leaves': ['admin', 'hr', 'supervisor', 'employee'],
  '/reports': ['admin', 'hr', 'supervisor'],
  '/settings': ['admin', 'hr', 'supervisor', 'employee'],
};

// ─── Login Attempt Tracking ─────────────────────────────────────
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 1 minute
const loginAttempts: Map<string, { count: number; lockedUntil: number }> = new Map();

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  setRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessRoute: (path: string) => boolean;
  refreshSession: () => void;
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

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  sessionExpiresAt: null,

  login: (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Check lockout
      const attempts = loginAttempts.get(normalizedEmail);
      if (attempts && attempts.lockedUntil > Date.now()) {
        const secondsLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
        return { success: false, error: `Account locked. Try again in ${secondsLeft}s.` };
      }

      const demoUser = DEMO_USERS[normalizedEmail];
      if (!demoUser || demoUser.password !== password) {
        // Track failed attempts
        const current = loginAttempts.get(normalizedEmail) ?? { count: 0, lockedUntil: 0 };
        current.count++;
        if (current.count >= MAX_LOGIN_ATTEMPTS) {
          current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
          current.count = 0;
          loginAttempts.set(normalizedEmail, current);
          return { success: false, error: 'Too many failed attempts. Account locked for 1 minute.' };
        }
        loginAttempts.set(normalizedEmail, current);
        const remaining = MAX_LOGIN_ATTEMPTS - current.count;
        return { success: false, error: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` };
      }

      // Successful login — reset attempts
      loginAttempts.delete(normalizedEmail);
      const { password: _, ...user } = demoUser;
      void _;
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      set({
        user,
        token: `demo-jwt-${user.id}-${Date.now()}`,
        isAuthenticated: true,
        sessionExpiresAt: expiresAt,
      });
      toast.success('Welcome Back', `Signed in as ${user.name} (${user.role})`);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, sessionExpiresAt: null });
    toast.info('Signed Out', 'You have been logged out successfully.');
  },

  setRole: (role: UserRole) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, role } };
    });
  },

  hasPermission: (permission: Permission) => {
    const user = get().user;
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  },

  canAccessRoute: (path: string) => {
    const user = get().user;
    if (!user) return false;
    const allowedRoles = ROUTE_ROLES[path];
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  },

  refreshSession: () => {
    set({ sessionExpiresAt: Date.now() + SESSION_DURATION_MS });
  },
}));
