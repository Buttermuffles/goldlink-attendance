import { create } from 'zustand';
import type { LeaveRequest, LeaveStatus } from '@/types';
import { mockLeaveRequests } from '@/lib/mockData';
import { toast } from '@/stores/toastStore';

interface LeaveStore {
  leaves: LeaveRequest[];
  addLeave: (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  updateLeave: (id: string, data: Partial<LeaveRequest>) => void;
  deleteLeave: (id: string) => void;
  approveLeave: (id: string, approvedBy: string) => void;
  rejectLeave: (id: string) => void;
  getLeave: (id: string) => LeaveRequest | undefined;
}

let lvCounter = mockLeaveRequests.length;

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  leaves: [...mockLeaveRequests],

  addLeave: (data) => {
    try {
      lvCounter++;
      const leave: LeaveRequest = {
        ...data,
        id: `lv-${String(lvCounter).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({ leaves: [...state.leaves, leave] }));
      toast.success('Leave Filed', `${data.type} leave request submitted.`);
    } catch (err) {
      toast.error('Failed to File Leave', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  updateLeave: (id, data) => {
    try {
      const existing = get().leaves.find((l) => l.id === id);
      if (!existing) throw new Error('Leave request not found.');
      set((state) => ({
        leaves: state.leaves.map((l) => (l.id === id ? { ...l, ...data } : l)),
      }));
      toast.success('Leave Updated', `Leave request for ${existing.employeeName} updated.`);
    } catch (err) {
      toast.error('Failed to Update Leave', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  deleteLeave: (id) => {
    try {
      const existing = get().leaves.find((l) => l.id === id);
      if (!existing) throw new Error('Leave request not found.');
      set((state) => ({ leaves: state.leaves.filter((l) => l.id !== id) }));
      toast.success('Leave Deleted', `Leave request for ${existing.employeeName} removed.`);
    } catch (err) {
      toast.error('Failed to Delete Leave', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  approveLeave: (id, approvedBy) => {
    try {
      const existing = get().leaves.find((l) => l.id === id);
      if (!existing) throw new Error('Leave request not found.');
      if (existing.status !== 'pending') throw new Error('Only pending leaves can be approved.');
      set((state) => ({
        leaves: state.leaves.map((l) =>
          l.id === id ? { ...l, status: 'approved' as LeaveStatus, approvedBy } : l
        ),
      }));
      toast.success('Leave Approved', `${existing.employeeName}'s ${existing.type} leave approved.`);
    } catch (err) {
      toast.error('Failed to Approve Leave', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  rejectLeave: (id) => {
    try {
      const existing = get().leaves.find((l) => l.id === id);
      if (!existing) throw new Error('Leave request not found.');
      if (existing.status !== 'pending') throw new Error('Only pending leaves can be rejected.');
      set((state) => ({
        leaves: state.leaves.map((l) =>
          l.id === id ? { ...l, status: 'rejected' as LeaveStatus } : l
        ),
      }));
      toast.success('Leave Rejected', `${existing.employeeName}'s ${existing.type} leave rejected.`);
    } catch (err) {
      toast.error('Failed to Reject Leave', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  getLeave: (id) => get().leaves.find((l) => l.id === id),
}));
