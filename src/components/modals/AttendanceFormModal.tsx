import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { AttendanceRecord, AttendanceStatus } from '@/types';

interface AttendanceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AttendanceRecord, 'id'>) => void;
  record?: AttendanceRecord | null;
  employeeNames: { label: string; value: string; name: string }[];
}

export function AttendanceFormModal({ open, onClose, onSubmit, record, employeeNames }: AttendanceFormModalProps): React.ReactElement {
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    status: 'on-time' as AttendanceStatus,
    hoursWorked: 0,
    overtimeHours: 0,
    locationMismatch: false,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setForm({
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        clockIn: record.clockIn ?? '',
        clockOut: record.clockOut ?? '',
        status: record.status,
        hoursWorked: record.hoursWorked,
        overtimeHours: record.overtimeHours,
        locationMismatch: record.locationMismatch,
        notes: record.notes ?? '',
      });
    } else {
      setForm({
        employeeId: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        clockIn: '',
        clockOut: '',
        status: 'on-time',
        hoursWorked: 0,
        overtimeHours: 0,
        locationMismatch: false,
        notes: '',
      });
    }
    setErrors({});
  }, [record, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.employeeId) e.employeeId = 'Employee is required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      clockIn: form.clockIn || undefined,
      clockOut: form.clockOut || undefined,
      notes: form.notes || undefined,
    });
    onClose();
  };

  const set = (field: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleEmployeeChange = (empId: string) => {
    const emp = employeeNames.find((e) => e.value === empId);
    setForm((prev) => ({ ...prev, employeeId: empId, employeeName: emp?.name ?? '' }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{record ? 'Edit Attendance Record' : 'Add Attendance Record'}</DialogTitle>
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
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Date *</label>
          <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Clock In</label>
            <Input type="time" value={form.clockIn} onChange={(e) => set('clockIn', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Clock Out</label>
            <Input type="time" value={form.clockOut} onChange={(e) => set('clockOut', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Status</label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value)} options={[
              { label: 'On Time', value: 'on-time' },
              { label: 'Late', value: 'late' },
              { label: 'Absent', value: 'absent' },
              { label: 'On Leave', value: 'on-leave' },
              { label: 'Half Day', value: 'half-day' },
              { label: 'Overtime', value: 'overtime' },
            ]} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Hours Worked</label>
            <Input type="number" step="0.1" value={form.hoursWorked || ''} onChange={(e) => set('hoursWorked', Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Overtime Hours</label>
          <Input type="number" step="0.1" value={form.overtimeHours || ''} onChange={(e) => set('overtimeHours', Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Notes</label>
          <Input value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional notes" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{record ? 'Save Changes' : 'Add Record'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
