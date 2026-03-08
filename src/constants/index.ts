export const APP_NAME = 'GoldLink Infratek';
export const APP_TAGLINE = 'Powering Infrastructure, Powering People';
export const TIMEZONE = 'Asia/Manila';
export const CURRENCY = 'PHP';
export const GEOFENCE_DEFAULT_RADIUS = 100; // meters

export const DEPARTMENTS = [
  'Engineering',
  'Construction',
  'Operations',
  'Human Resources',
  'Finance',
  'Administration',
  'Safety',
  'Logistics',
] as const;

export const STATUS_COLORS: Record<string, string> = {
  'on-time': '#22c55e',
  'late': '#f59e0b',
  'absent': '#ef4444',
  'on-leave': '#3b82f6',
  'half-day': '#a855f7',
  'holiday': '#FF9B2E',
  'overtime': '#06b6d4',
  'active': '#22c55e',
  'resigned': '#ef4444',
  'terminated': '#ef4444',
  'pending': '#f59e0b',
  'approved': '#22c55e',
  'rejected': '#ef4444',
  'draft': '#a3a3a3',
  'finalized': '#3b82f6',
  'disbursed': '#22c55e',
};

// Philippine Government Contribution Rates (2023-2026)
export const SSS_CONTRIBUTION_TABLE = [
  { minSalary: 0, maxSalary: 4249.99, employeeShare: 180, employerShare: 380 },
  { minSalary: 4250, maxSalary: 4749.99, employeeShare: 202.5, employerShare: 427.5 },
  { minSalary: 4750, maxSalary: 5249.99, employeeShare: 225, employerShare: 475 },
  { minSalary: 5250, maxSalary: 5749.99, employeeShare: 247.5, employerShare: 522.5 },
  { minSalary: 5750, maxSalary: 6249.99, employeeShare: 270, employerShare: 570 },
  { minSalary: 6250, maxSalary: 6749.99, employeeShare: 292.5, employerShare: 617.5 },
  { minSalary: 6750, maxSalary: 7249.99, employeeShare: 315, employerShare: 665 },
  { minSalary: 7250, maxSalary: 7749.99, employeeShare: 337.5, employerShare: 712.5 },
  { minSalary: 7750, maxSalary: 8249.99, employeeShare: 360, employerShare: 760 },
  { minSalary: 8250, maxSalary: 8749.99, employeeShare: 382.5, employerShare: 807.5 },
  { minSalary: 8750, maxSalary: 9249.99, employeeShare: 405, employerShare: 855 },
  { minSalary: 9250, maxSalary: 9749.99, employeeShare: 427.5, employerShare: 902.5 },
  { minSalary: 9750, maxSalary: 10249.99, employeeShare: 450, employerShare: 950 },
  { minSalary: 10250, maxSalary: 10749.99, employeeShare: 472.5, employerShare: 997.5 },
  { minSalary: 10750, maxSalary: 11249.99, employeeShare: 495, employerShare: 1045 },
  { minSalary: 11250, maxSalary: 11749.99, employeeShare: 517.5, employerShare: 1092.5 },
  { minSalary: 11750, maxSalary: 12249.99, employeeShare: 540, employerShare: 1140 },
  { minSalary: 12250, maxSalary: 12749.99, employeeShare: 562.5, employerShare: 1187.5 },
  { minSalary: 12750, maxSalary: 13249.99, employeeShare: 585, employerShare: 1235 },
  { minSalary: 13250, maxSalary: 13749.99, employeeShare: 607.5, employerShare: 1282.5 },
  { minSalary: 13750, maxSalary: 14249.99, employeeShare: 630, employerShare: 1330 },
  { minSalary: 14250, maxSalary: 14749.99, employeeShare: 652.5, employerShare: 1377.5 },
  { minSalary: 14750, maxSalary: 15249.99, employeeShare: 675, employerShare: 1425 },
  { minSalary: 15250, maxSalary: 15749.99, employeeShare: 697.5, employerShare: 1472.5 },
  { minSalary: 15750, maxSalary: 29999.99, employeeShare: 900, employerShare: 1900 },
  { minSalary: 30000, maxSalary: Infinity, employeeShare: 1350, employerShare: 2850 },
] as const;

export const PHILHEALTH_RATE = 0.05; // 5% split 50/50
export const PAGIBIG_EMPLOYEE_SHARE = 200;
export const PAGIBIG_EMPLOYER_SHARE = 200;
