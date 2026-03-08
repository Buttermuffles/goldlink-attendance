import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { PayrollRecord, PayPeriodType } from '@/types';

interface PayrollFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PayrollRecord, 'id' | 'createdAt'>) => void;
  record?: PayrollRecord | null;
  employeeNames: { label: string; value: string; name: string; dailyRate: number }[];
}

export function PayrollFormModal({ open, onClose, onSubmit, record, employeeNames }: PayrollFormModalProps): React.ReactElement {
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    payPeriodType: 'semi-monthly' as PayPeriodType,
    workingDays: 0,
    dailyRate: 0,
    basicPay: 0,
    overtimePay: 0,
    allowances: 0,
    hazardPay: 0,
    grossPay: 0,
    sssDeduction: 0,
    philhealthDeduction: 0,
    pagibigDeduction: 200,
    withholdingTax: 0,
    otherDeductions: 0,
    totalDeductions: 0,
    netPay: 0,
    status: 'draft' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      const { id, createdAt, ...rest } = record;
      setForm(rest);
    } else {
      setForm({
        employeeId: '',
        employeeName: '',
        payPeriodStart: '',
        payPeriodEnd: '',
        payPeriodType: 'semi-monthly',
        workingDays: 0,
        dailyRate: 0,
        basicPay: 0,
        overtimePay: 0,
        allowances: 0,
        hazardPay: 0,
        grossPay: 0,
        sssDeduction: 0,
        philhealthDeduction: 0,
        pagibigDeduction: 200,
        withholdingTax: 0,
        otherDeductions: 0,
        totalDeductions: 0,
        netPay: 0,
        status: 'draft',
      });
    }
    setErrors({});
  }, [record, open]);

  // Auto-compute
  useEffect(() => {
    const basicPay = form.workingDays * form.dailyRate;
    const grossPay = basicPay + form.overtimePay + form.allowances + form.hazardPay;
    const totalDeductions = form.sssDeduction + form.philhealthDeduction + form.pagibigDeduction + form.withholdingTax + form.otherDeductions;
    const netPay = grossPay - totalDeductions;
    setForm((prev) => ({ ...prev, basicPay, grossPay, totalDeductions, netPay }));
  }, [form.workingDays, form.dailyRate, form.overtimePay, form.allowances, form.hazardPay, form.sssDeduction, form.philhealthDeduction, form.pagibigDeduction, form.withholdingTax, form.otherDeductions]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.employeeId) e.employeeId = 'Employee is required';
    if (!form.payPeriodStart) e.payPeriodStart = 'Pay period start is required';
    if (!form.payPeriodEnd) e.payPeriodEnd = 'Pay period end is required';
    if (form.workingDays <= 0) e.workingDays = 'Working days must be > 0';
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

  const handleEmployeeChange = (empId: string) => {
    const emp = employeeNames.find((e) => e.value === empId);
    setForm((prev) => ({
      ...prev,
      employeeId: empId,
      employeeName: emp?.name ?? '',
      dailyRate: emp?.dailyRate ?? 0,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{record ? 'Edit Payroll Record' : 'Create Payroll Record'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div>
          <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Employee *</label>
          <Select
            value={form.employeeId}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            options={[{ label: 'Select Employee...', value: '' }, ...employeeNames]}
          />
          {errors.employeeId && <p className="text-xs text-red-400 mt-1">{errors.employeeId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Period Start *</label>
            <Input type="date" value={form.payPeriodStart} onChange={(e) => set('payPeriodStart', e.target.value)} />
            {errors.payPeriodStart && <p className="text-xs text-red-400 mt-1">{errors.payPeriodStart}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Period End *</label>
            <Input type="date" value={form.payPeriodEnd} onChange={(e) => set('payPeriodEnd', e.target.value)} />
            {errors.payPeriodEnd && <p className="text-xs text-red-400 mt-1">{errors.payPeriodEnd}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Period Type</label>
            <Select value={form.payPeriodType} onChange={(e) => set('payPeriodType', e.target.value)} options={[
              { label: 'Semi-Monthly', value: 'semi-monthly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
            ]} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Working Days *</label>
            <Input type="number" value={form.workingDays || ''} onChange={(e) => set('workingDays', Number(e.target.value))} />
            {errors.workingDays && <p className="text-xs text-red-400 mt-1">{errors.workingDays}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Daily Rate (₱)</label>
            <Input type="number" value={form.dailyRate || ''} onChange={(e) => set('dailyRate', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#A3A3A3] mb-1 block">Basic Pay</label>
            <Input type="number" value={form.basicPay} disabled className="opacity-60" />
          </div>
        </div>

        {/* Earnings */}
        <div className="border-t border-[rgb(55,55,55)] pt-3">
          <p className="text-xs font-medium text-[#A3A3A3] mb-2 uppercase tracking-wider">Earnings</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Overtime (₱)</label>
              <Input type="number" value={form.overtimePay || ''} onChange={(e) => set('overtimePay', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Allowances</label>
              <Input type="number" value={form.allowances || ''} onChange={(e) => set('allowances', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Hazard Pay</label>
              <Input type="number" value={form.hazardPay || ''} onChange={(e) => set('hazardPay', Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="border-t border-[rgb(55,55,55)] pt-3">
          <p className="text-xs font-medium text-[#A3A3A3] mb-2 uppercase tracking-wider">Deductions</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">SSS</label>
              <Input type="number" value={form.sssDeduction || ''} onChange={(e) => set('sssDeduction', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">PhilHealth</label>
              <Input type="number" value={form.philhealthDeduction || ''} onChange={(e) => set('philhealthDeduction', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Pag-IBIG</label>
              <Input type="number" value={form.pagibigDeduction || ''} onChange={(e) => set('pagibigDeduction', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs text-[#A3A3A3] mb-1 block">Tax</label>
              <Input type="number" value={form.withholdingTax || ''} onChange={(e) => set('withholdingTax', Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-[#A3A3A3] mb-1 block">Other Deductions</label>
            <Input type="number" value={form.otherDeductions || ''} onChange={(e) => set('otherDeductions', Number(e.target.value))} />
          </div>
        </div>

        {/* Summary */}
        <div className="border-t border-[rgb(55,55,55)] pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-[#A3A3A3]">Gross Pay</span>
            <span className="text-[#FAFAFA] font-medium">₱{form.grossPay.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#A3A3A3]">Total Deductions</span>
            <span className="text-red-400 font-medium">-₱{form.totalDeductions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-[#FAFAFA]">Net Pay</span>
            <span className="text-green-400">₱{form.netPay.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1">{record ? 'Save Changes' : 'Create Payroll'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
