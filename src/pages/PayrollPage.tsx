import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { usePayrollStore } from '@/stores/payrollStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useAuthStore } from '@/stores/authStore';
import { PayrollFormModal } from '@/components/modals/PayrollFormModal';
import { PayrollDetailModal } from '@/components/modals/PayrollDetailModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/utils';
import type { PayrollRecord } from '@/types';
import {
  DollarSign,
  Download,
  FileText,
  Lock,
  Calculator,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
} from 'lucide-react';

export function PayrollPage(): React.ReactElement {
  const { records, addRecord, updateRecord, deleteRecord, finalizeRecord } = usePayrollStore();
  const { employees } = useEmployeeStore();
  const { hasPermission } = useAuthStore();
  const [periodFilter, setPeriodFilter] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editRecord, setEditRecord] = useState<PayrollRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<PayrollRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PayrollRecord | null>(null);

  const employeeNames = employees.map((e) => ({
    label: `${e.firstName} ${e.lastName}`,
    value: e.id,
    name: `${e.firstName} ${e.lastName}`,
    dailyRate: e.dailyRate,
  }));

  const filteredPayroll = periodFilter
    ? records.filter((p) => p.status === periodFilter)
    : records;

  const totalGross = filteredPayroll.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = filteredPayroll.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalNet = filteredPayroll.reduce((sum, p) => sum + p.netPay, 0);

  const handleAdd = () => {
    setEditRecord(null);
    setShowFormModal(true);
  };

  const handleEdit = (record: PayrollRecord) => {
    setEditRecord(record);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: Omit<PayrollRecord, 'id'>) => {
    try {
      if (editRecord) {
        updateRecord(editRecord.id, data);
      } else {
        addRecord(data);
      }
    } catch {
      // Error handled inside store with toast
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      try {
        deleteRecord(deleteTarget.id);
      } catch {
        // Error handled inside store
      }
      setDeleteTarget(null);
    }
  };

  const handleFinalize = (record: PayrollRecord) => {
    try {
      finalizeRecord(record.id);
    } catch {
      // Error handled inside store
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Payroll</h1>
          <p className="text-sm text-[#A3A3A3]">Payroll processing & disbursement management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export CSV
          </Button>
          {hasPermission('payroll:create') && (
            <Button className="gap-2" onClick={handleAdd}>
              <Plus size={16} />
              Run Payroll
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A3A3A3]">Total Gross Pay</p>
                <p className="text-xl font-bold text-[#FAFAFA] mt-1">{formatCurrency(totalGross)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                <DollarSign size={20} className="text-brand-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A3A3A3]">Total Deductions</p>
                <p className="text-xl font-bold text-red-400 mt-1">{formatCurrency(totalDeductions)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#A3A3A3]">Total Net Pay</p>
                <p className="text-xl font-bold text-green-400 mt-1">{formatCurrency(totalNet)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign size={20} className="text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <Select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              options={[
                { label: 'All Status', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Finalized', value: 'finalized' },
                { label: 'Disbursed', value: 'disbursed' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Payroll Records</CardTitle>
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <Lock size={12} />
              <span>{filteredPayroll.filter(p => p.status === 'finalized').length} finalized</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(55,55,55)]">
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Employee</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden md:table-cell">Period</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Gross</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">SSS</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">PhilH</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">HDMF</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden md:table-cell">Tax</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Net Pay</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayroll.map((record) => (
                  <tr key={record.id} className="border-b border-[rgb(55,55,55)] hover:bg-[rgb(26,26,26)] transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-[#FAFAFA]">{record.employeeName}</p>
                      <p className="text-xs text-[#A3A3A3]">{record.workingDays} days</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm text-[#FAFAFA]">{record.payPeriodStart}</p>
                      <p className="text-xs text-[#A3A3A3]">to {record.payPeriodEnd}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-sm font-medium text-[#FAFAFA]">{formatCurrency(record.grossPay)}</p>
                    </td>
                    <td className="p-4 text-right hidden lg:table-cell">
                      <p className="text-sm text-red-400">{formatCurrency(record.sssDeduction)}</p>
                    </td>
                    <td className="p-4 text-right hidden lg:table-cell">
                      <p className="text-sm text-red-400">{formatCurrency(record.philhealthDeduction)}</p>
                    </td>
                    <td className="p-4 text-right hidden lg:table-cell">
                      <p className="text-sm text-red-400">{formatCurrency(record.pagibigDeduction)}</p>
                    </td>
                    <td className="p-4 text-right hidden md:table-cell">
                      <p className="text-sm text-red-400">{formatCurrency(record.withholdingTax)}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-sm font-bold text-green-400">{formatCurrency(record.netPay)}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={record.status}>{record.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => setViewRecord(record)}
                          className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                          title="View Payslip"
                        >
                          <FileText size={14} />
                        </button>
                        {record.status === 'draft' && hasPermission('payroll:update') && (
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {record.status === 'draft' && hasPermission('payroll:finalize') && (
                          <button
                            onClick={() => handleFinalize(record)}
                            className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors"
                            title="Finalize"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {record.status === 'draft' && hasPermission('payroll:delete') && (
                          <button
                            onClick={() => setDeleteTarget(record)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <PayrollFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        record={editRecord}
        employeeNames={employeeNames}
      />

      {/* View Payslip Modal */}
      <PayrollDetailModal
        open={!!viewRecord}
        onClose={() => setViewRecord(null)}
        record={viewRecord}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Payroll Record"
        message={`Are you sure you want to delete the payroll record for ${deleteTarget?.employeeName}?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
