import { create } from 'zustand';
import type { Worksite } from '@/types';
import { mockWorksites } from '@/lib/mockData';
import { toast } from '@/stores/toastStore';

interface WorksiteStore {
  worksites: Worksite[];
  addWorksite: (data: Omit<Worksite, 'id'>) => void;
  updateWorksite: (id: string, data: Partial<Worksite>) => void;
  deleteWorksite: (id: string) => void;
  getWorksite: (id: string) => Worksite | undefined;
}

let wsCounter = mockWorksites.length;

export const useWorksiteStore = create<WorksiteStore>((set, get) => ({
  worksites: [...mockWorksites],

  addWorksite: (data) => {
    try {
      wsCounter++;
      const worksite: Worksite = { ...data, id: `site-${String(wsCounter).padStart(3, '0')}` };
      set((state) => ({ worksites: [...state.worksites, worksite] }));
      toast.success('Worksite Created', `${data.name} has been added.`);
    } catch (err) {
      toast.error('Failed to Create Worksite', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  updateWorksite: (id, data) => {
    try {
      const existing = get().worksites.find((w) => w.id === id);
      if (!existing) throw new Error('Worksite not found.');
      set((state) => ({
        worksites: state.worksites.map((w) => (w.id === id ? { ...w, ...data } : w)),
      }));
      toast.success('Worksite Updated', `${existing.name} has been updated.`);
    } catch (err) {
      toast.error('Failed to Update Worksite', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  deleteWorksite: (id) => {
    try {
      const existing = get().worksites.find((w) => w.id === id);
      if (!existing) throw new Error('Worksite not found.');
      set((state) => ({ worksites: state.worksites.filter((w) => w.id !== id) }));
      toast.success('Worksite Deleted', `${existing.name} has been removed.`);
    } catch (err) {
      toast.error('Failed to Delete Worksite', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  },

  getWorksite: (id) => get().worksites.find((w) => w.id === id),
}));
