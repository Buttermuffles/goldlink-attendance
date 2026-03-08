import React from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import type { PayrollRecord } from '@/types';

interface PayrollDetailModalProps {
  open: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

export function PayrollDetailModal({ open, onClose, record }: PayrollDetailModalProps): React.ReactElement {
  if (!record) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Payslip — {record.employeeName}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#A3A3A3]">Pay Period</p>
            <p className="text-sm text-[#FAFAFA]">{record.payPeriodStart} to {record.payPeriodEnd}</p>
          </div>
          <Badge variant={record.status}>{record.status}</Badge>
        </div>

        <div className="bg-[rgb(26,26,26)] rounded-lg p-4 space-y-3">
          <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">Earnings</p>
          <div className="space-y-2">
            <Row label={`Basic Pay (${record.workingDays} days × ${formatCurrency(record.dailyRate)})`} value={formatCurrency(record.basicPay)} />
            <Row label="Overtime Pay" value={formatCurrency(record.overtimePay)} />
            <Row label="Allowances" value={formatCurrency(record.allowances)} />
            <Row label="Hazard Pay" value={formatCurrency(record.hazardPay)} />
            <div className="border-t border-[rgb(55,55,55)] pt-2">
              <Row label="Gross Pay" value={formatCurrency(record.grossPay)} bold />
            </div>
          </div>
        </div>

        <div className="bg-[rgb(26,26,26)] rounded-lg p-4 space-y-3">
          <p className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">Deductions</p>
          <div className="space-y-2">
            <Row label="SSS" value={`-${formatCurrency(record.sssDeduction)}`} color="text-red-400" />
            <Row label="PhilHealth" value={`-${formatCurrency(record.philhealthDeduction)}`} color="text-red-400" />
            <Row label="Pag-IBIG" value={`-${formatCurrency(record.pagibigDeduction)}`} color="text-red-400" />
            <Row label="Withholding Tax" value={`-${formatCurrency(record.withholdingTax)}`} color="text-red-400" />
            {record.otherDeductions > 0 && (
              <Row label="Other Deductions" value={`-${formatCurrency(record.otherDeductions)}`} color="text-red-400" />
            )}
            <div className="border-t border-[rgb(55,55,55)] pt-2">
              <Row label="Total Deductions" value={`-${formatCurrency(record.totalDeductions)}`} bold color="text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-brand-primary/10 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-[#FAFAFA]">Net Pay</span>
            <span className="text-lg font-bold text-green-400">{formatCurrency(record.netPay)}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  );
}

function Row({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }): React.ReactElement {
  return (
    <div className="flex justify-between text-sm">
      <span className={`${bold ? 'font-semibold text-[#FAFAFA]' : 'text-[#A3A3A3]'}`}>{label}</span>
      <span className={`${bold ? 'font-semibold' : ''} ${color ?? 'text-[#FAFAFA]'}`}>{value}</span>
    </div>
  );
}
