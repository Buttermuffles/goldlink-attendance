import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Worksite } from '@/types';

interface WorksiteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Worksite, 'id'>) => void;
  worksite?: Worksite | null;
}

const DEFAULT_FORM = {
  name: '',
  address: '',
  lat: 14.5880,
  lng: 121.0610,
  geoFenceRadius: 100,
  isActive: true,
};

export function WorksiteFormModal({ open, onClose, onSubmit, worksite }: WorksiteFormModalProps): React.ReactElement {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (worksite) {
      setForm({
        name: worksite.name,
        address: worksite.address,
        lat: worksite.lat,
        lng: worksite.lng,
        geoFenceRadius: worksite.geoFenceRadius,
        isActive: worksite.isActive,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [worksite, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Site name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (form.geoFenceRadius <= 0) e.geoFenceRadius = 'Radius must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const set = (field: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{worksite ? 'Edit Worksite' : 'Add New Worksite'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Site Name *</label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. BGC Tower Project" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Address *</label>
          <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Full address" />
          {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Latitude</label>
            <Input type="number" step="0.0001" value={form.lat} onChange={(e) => set('lat', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Longitude</label>
            <Input type="number" step="0.0001" value={form.lng} onChange={(e) => set('lng', Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Geofence Radius (m)</label>
            <Input type="number" value={form.geoFenceRadius} onChange={(e) => set('geoFenceRadius', Number(e.target.value))} />
            {errors.geoFenceRadius && <p className="text-xs text-red-400 mt-1">{errors.geoFenceRadius}</p>}
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-[#FAFAFA] cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 rounded border-[rgb(55,55,55)] bg-[rgb(36,36,36)] accent-brand-primary"
              />
              Active Site
            </label>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{worksite ? 'Save Changes' : 'Add Worksite'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
