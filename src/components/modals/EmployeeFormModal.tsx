import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DEPARTMENTS } from '@/constants';
import type { Employee, UserRole, EmploymentStatus } from '@/types';

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  employee?: Employee | null;
}

const DEFAULT_FORM = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'employee' as UserRole,
  department: '',
  position: '',
  siteAssignment: '',
  dailyRate: 0,
  status: 'active' as EmploymentStatus,
  dateHired: new Date().toISOString().split('T')[0],
  sssNumber: '',
  philhealthNumber: '',
  pagibigNumber: '',
  tinNumber: '',
  bankName: '',
  bankAccountNumber: '',
};

export function EmployeeFormModal({ open, onClose, onSubmit, employee }: EmployeeFormModalProps): React.ReactElement {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setForm({
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        siteAssignment: employee.siteAssignment,
        dailyRate: employee.dailyRate,
        status: employee.status,
        dateHired: employee.dateHired,
        sssNumber: employee.sssNumber ?? '',
        philhealthNumber: employee.philhealthNumber ?? '',
        pagibigNumber: employee.pagibigNumber ?? '',
        tinNumber: employee.tinNumber ?? '',
        bankName: employee.bankName ?? '',
        bankAccountNumber: employee.bankAccountNumber ?? '',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [employee, open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.position.trim()) e.position = 'Position is required';
    if (form.dailyRate <= 0) e.dailyRate = 'Daily rate must be greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const set = (field: string, value: string | number) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">First Name *</label>
            <Input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
            {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Last Name *</label>
            <Input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
            {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Employee ID</label>
          <Input value={form.employeeId} onChange={(e) => set('employeeId', e.target.value)} placeholder="GL-2024-XXX" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Email *</label>
          <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Phone</label>
          <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+63 9XX XXX XXXX" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Role</label>
            <Select value={form.role} onChange={(e) => set('role', e.target.value)} options={[
              { label: 'Admin', value: 'admin' },
              { label: 'HR', value: 'hr' },
              { label: 'Supervisor', value: 'supervisor' },
              { label: 'Employee', value: 'employee' },
            ]} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Department *</label>
            <Select value={form.department} onChange={(e) => set('department', e.target.value)} options={[
              { label: 'Select...', value: '' },
              ...DEPARTMENTS.map((d) => ({ label: d, value: d })),
            ]} />
            {errors.department && <p className="text-xs text-red-400 mt-1">{errors.department}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Position *</label>
            <Input value={form.position} onChange={(e) => set('position', e.target.value)} />
            {errors.position && <p className="text-xs text-red-400 mt-1">{errors.position}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Site Assignment</label>
            <Input value={form.siteAssignment} onChange={(e) => set('siteAssignment', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Daily Rate (₱) *</label>
            <Input type="number" value={form.dailyRate || ''} onChange={(e) => set('dailyRate', Number(e.target.value))} />
            {errors.dailyRate && <p className="text-xs text-red-400 mt-1">{errors.dailyRate}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Status</label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value)} options={[
              { label: 'Active', value: 'active' },
              { label: 'On Leave', value: 'on-leave' },
              { label: 'Resigned', value: 'resigned' },
              { label: 'Terminated', value: 'terminated' },
            ]} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Date Hired</label>
          <Input type="date" value={form.dateHired} onChange={(e) => set('dateHired', e.target.value)} />
        </div>

        {/* Government IDs */}
        <div className="border-t border-[rgb(55,55,55)] pt-3">
          <p className="text-xs font-medium text-[#A3A3A3] mb-2 uppercase tracking-wider">Government IDs</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">SSS</label>
              <Input value={form.sssNumber} onChange={(e) => set('sssNumber', e.target.value)} placeholder="XX-XXXXXXX-X" />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">PhilHealth</label>
              <Input value={form.philhealthNumber} onChange={(e) => set('philhealthNumber', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Pag-IBIG</label>
              <Input value={form.pagibigNumber} onChange={(e) => set('pagibigNumber', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">TIN</label>
              <Input value={form.tinNumber} onChange={(e) => set('tinNumber', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="border-t border-[rgb(55,55,55)] pt-3">
          <p className="text-xs font-medium text-[#A3A3A3] mb-2 uppercase tracking-wider">Bank Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Bank Name</label>
              <Input value={form.bankName} onChange={(e) => set('bankName', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Account Number</label>
              <Input value={form.bankAccountNumber} onChange={(e) => set('bankAccountNumber', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{employee ? 'Save Changes' : 'Add Employee'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
