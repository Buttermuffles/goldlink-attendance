// ============================================================
// GoldLink Infratek Corporation — Core Type Definitions
// ============================================================

// ─── Enums ───────────────────────────────────────────────────
export type UserRole = 'admin' | 'hr' | 'supervisor' | 'employee';

export type AttendanceStatus =
  | 'on-time'
  | 'late'
  | 'absent'
  | 'on-leave'
  | 'half-day'
  | 'holiday'
  | 'overtime';

export type EmploymentStatus = 'active' | 'on-leave' | 'resigned' | 'terminated';

export type LeaveType = 'vacation' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type PayPeriodType = 'weekly' | 'semi-monthly' | 'monthly';

export type ClockMethod = 'gps' | 'manual' | 'ip-fallback';

// ─── User & Auth ─────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Employee ────────────────────────────────────────────────
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  position: string;
  siteAssignment: string;
  photo?: string;
  dailyRate: number;
  status: EmploymentStatus;
  dateHired: string;
  sssNumber?: string;
  philhealthNumber?: string;
  pagibigNumber?: string;
  tinNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── GPS & Location ──────────────────────────────────────────
export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
  method: ClockMethod;
}

export interface GeoFence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  siteId: string;
}

// ─── Attendance ──────────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  clockInLocation?: GeoLocation;
  clockOutLocation?: GeoLocation;
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  locationMismatch: boolean;
  notes?: string;
  approvedBy?: string;
}

// ─── Leave ───────────────────────────────────────────────────
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  createdAt: string;
}

// ─── Payroll ─────────────────────────────────────────────────
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payPeriodType: PayPeriodType;
  workingDays: number;
  dailyRate: number;
  basicPay: number;
  overtimePay: number;
  allowances: number;
  hazardPay: number;
  grossPay: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  withholdingTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'finalized' | 'disbursed';
  createdAt: string;
}

// ─── Worksite ────────────────────────────────────────────────
export interface Worksite {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  geoFenceRadius: number;
  isActive: boolean;
}

// ─── Dashboard Stats ─────────────────────────────────────────
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  pendingLeaves: number;
  totalPayrollThisMonth: number;
  activeWorksites: number;
}

// ─── Navigation ──────────────────────────────────────────────
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}
