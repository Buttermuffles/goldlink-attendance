import { create } from 'zustand';
import type { PayrollRecord } from '@/types';
import { mockPayroll } from '@/lib/mockData';
import { toast } from '@/stores/toastStore';

interface PayrollStore {
  records: PayrollRecord[];
  addRecord: (data: Omit<PayrollRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, data: Partial<PayrollRecord>) => void;
  deleteRecord: (id: string) => void;
  finalizeRecord: (id: string) => void;
  getRecord: (id: string) => PayrollRecord | undefined;
}

let payCounter = mockPayroll.length;

export const usePayrollStore = create<PayrollStore>((set, get) => ({
  records: [...mockPayroll],

  addRecord: (data) => {
    try {
      payCounter++;
      const record: PayrollRecord = {
        ...data,
        id: `pay-${String(payCounter).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ records: [...state.records, record] }));
      toast.success('Payroll Created', `Payroll for ${data.employeeName} created.`);
    } catch (err) {
      toast.error('Failed to Create Payroll', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  updateRecord: (id, data) => {
    try {
      const existing = get().records.find((r) => r.id === id);
      if (!existing) throw new Error('Payroll record not found.');
      if (existing.status === 'finalized' || existing.status === 'disbursed') {
        throw new Error('Cannot edit finalized or disbursed payroll.');
      }
      set((state) => ({
        records: state.records.map((r) => (r.id === id ? { ...r, ...data } : r)),
      }));
      toast.success('Payroll Updated', `Payroll for ${existing.employeeName} updated.`);
    } catch (err) {
      toast.error('Failed to Update Payroll', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  deleteRecord: (id) => {
    try {
      const existing = get().records.find((r) => r.id === id);
      if (!existing) throw new Error('Payroll record not found.');
      if (existing.status === 'finalized' || existing.status === 'disbursed') {
        throw new Error('Cannot delete finalized or disbursed payroll.');
      }
      set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
      toast.success('Payroll Deleted', `Payroll for ${existing.employeeName} removed.`);
    } catch (err) {
      toast.error('Failed to Delete Payroll', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  finalizeRecord: (id) => {
    try {
      const existing = get().records.find((r) => r.id === id);
      if (!existing) throw new Error('Payroll record not found.');
      if (existing.status !== 'draft') throw new Error('Only draft payroll can be finalized.');
      set((state) => ({
        records: state.records.map((r) =>
          r.id === id ? { ...r, status: 'finalized' as const } : r
        ),
      }));
      toast.success('Payroll Finalized', `Payroll for ${existing.employeeName} finalized and locked.`);
    } catch (err) {
      toast.error('Failed to Finalize Payroll', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  getRecord: (id) => get().records.find((r) => r.id === id),
}));
