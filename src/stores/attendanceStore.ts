import { create } from 'zustand';
import type { AttendanceRecord } from '@/types';
import { mockAttendance } from '@/lib/mockData';
import { toast } from '@/stores/toastStore';

interface AttendanceStore {
  records: AttendanceRecord[];
  addRecord: (data: Omit<AttendanceRecord, 'id'>) => void;
  updateRecord: (id: string, data: Partial<AttendanceRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecord: (id: string) => AttendanceRecord | undefined;
}

let attCounter = mockAttendance.length;

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  records: [...mockAttendance],

  addRecord: (data) => {
    try {
      attCounter++;
      const record: AttendanceRecord = { ...data, id: `att-${String(attCounter).padStart(3, '0')}` };
      set((state) => ({ records: [...state.records, record] }));
      toast.success('Attendance Recorded', `Record for ${data.employeeName} added.`);
    } catch (err) {
      toast.error('Failed to Record Attendance', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  updateRecord: (id, data) => {
    try {
      const existing = get().records.find((r) => r.id === id);
      if (!existing) throw new Error('Attendance record not found.');
      set((state) => ({
        records: state.records.map((r) => (r.id === id ? { ...r, ...data } : r)),
      }));
      toast.success('Attendance Updated', `Record for ${existing.employeeName} updated.`);
    } catch (err) {
      toast.error('Failed to Update Attendance', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  deleteRecord: (id) => {
    try {
      const existing = get().records.find((r) => r.id === id);
      if (!existing) throw new Error('Attendance record not found.');
      set((state) => ({ records: state.records.filter((r) => r.id !== id) }));
      toast.success('Attendance Deleted', `Record for ${existing.employeeName} removed.`);
    } catch (err) {
      toast.error('Failed to Delete Attendance', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  getRecord: (id) => get().records.find((r) => r.id === id),
}));
