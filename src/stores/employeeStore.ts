import { create } from 'zustand';
import type { Employee } from '@/types';
import { mockEmployees } from '@/lib/mockData';
import { toast } from '@/stores/toastStore';

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
}

let empCounter = mockEmployees.length;

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [...mockEmployees],

  addEmployee: (data) => {
    try {
      empCounter++;
      const now = new Date().toISOString();
      const employee: Employee = {
        ...data,
        id: String(empCounter),
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({ employees: [...state.employees, employee] }));
      toast.success('Employee Created', `${data.firstName} ${data.lastName} has been added.`);
    } catch (err) {
      toast.error('Failed to Create Employee', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  updateEmployee: (id, data) => {
    try {
      const existing = get().employees.find((e) => e.id === id);
      if (!existing) throw new Error('Employee not found.');
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
        ),
      }));
      toast.success('Employee Updated', `${existing.firstName} ${existing.lastName}'s record has been updated.`);
    } catch (err) {
      toast.error('Failed to Update Employee', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  deleteEmployee: (id) => {
    try {
      const existing = get().employees.find((e) => e.id === id);
      if (!existing) throw new Error('Employee not found.');
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
      }));
      toast.success('Employee Deleted', `${existing.firstName} ${existing.lastName} has been removed.`);
    } catch (err) {
      toast.error('Failed to Delete Employee', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  getEmployee: (id) => get().employees.find((e) => e.id === id),
}));
