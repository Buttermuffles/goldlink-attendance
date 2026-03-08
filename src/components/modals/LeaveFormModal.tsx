import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { LeaveRequest, LeaveType, LeaveStatus } from '@/types';

interface LeaveFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  leave?: LeaveRequest | null;
  employeeNames: { label: string; value: string; name: string }[];
}

export function LeaveFormModal({ open, onClose, onSubmit, leave, employeeNames }: LeaveFormModalProps): React.ReactElement {
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    type: 'vacation' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending' as LeaveStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (leave) {
      setForm({
        employeeId: leave.employeeId,
        employeeName: leave.employeeName,
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
      });
    } else {
      setForm({
        employeeId: '',
        employeeName: '',
        type: 'vacation',
        startDate: '',
        endDate: '',
        reason: '',
        status: 'pending',
      });
    }
    setErrors({});
  }, [leave, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.employeeId) e.employeeId = 'Employee is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (!form.reason.trim()) e.reason = 'Reason is required';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      e.endDate = 'End date must be after start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleEmployeeChange = (empId: string) => {
    const emp = employeeNames.find((e) => e.value === empId);
    setForm((prev) => ({ ...prev, employeeId: empId, employeeName: emp?.name ?? '' }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{leave ? 'Edit Leave Request' : 'File Leave Request'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Employee *</label>
          <Select
            value={form.employeeId}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            options={[{ label: 'Select Employee...', value: '' }, ...employeeNames]}
          />
          {errors.employeeId && <p className="text-xs text-red-400 mt-1">{errors.employeeId}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Leave Type</label>
          <Select value={form.type} onChange={(e) => set('type', e.target.value)} options={[
            { label: 'Vacation', value: 'vacation' },
            { label: 'Sick', value: 'sick' },
            { label: 'Emergency', value: 'emergency' },
            { label: 'Maternity', value: 'maternity' },
            { label: 'Paternity', value: 'paternity' },
            { label: 'Unpaid', value: 'unpaid' },
          ]} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Start Date *</label>
            <Input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
            {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">End Date *</label>
            <Input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
            {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Reason *</label>
          <Input value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder="Reason for leave" />
          {errors.reason && <p className="text-xs text-red-400 mt-1">{errors.reason}</p>}
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{leave ? 'Save Changes' : 'Submit Leave'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
