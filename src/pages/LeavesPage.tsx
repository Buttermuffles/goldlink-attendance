import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLeaveStore } from '@/stores/leaveStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useAuthStore } from '@/stores/authStore';
import { LeaveFormModal } from '@/components/modals/LeaveFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import type { LeaveRequest } from '@/types';
import { FileText, Check, X, Plus, Calendar, Edit, Trash2 } from 'lucide-react';

export function LeavesPage(): React.ReactElement {
  const { leaves, addLeave, updateLeave, deleteLeave, approveLeave, rejectLeave } = useLeaveStore();
  const { employees } = useEmployeeStore();
  const { hasPermission, user } = useAuthStore();
  const [showFormModal, setShowFormModal] = useState(false);
  const [editLeave, setEditLeave] = useState<LeaveRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeaveRequest | null>(null);

  const employeeNames = employees.map((e) => ({
    label: `${e.firstName} ${e.lastName}`,
    value: e.id,
    name: `${e.firstName} ${e.lastName}`,
  }));

  const handleAdd = () => {
    setEditLeave(null);
    setShowFormModal(true);
  };

  const handleEdit = (leave: LeaveRequest) => {
    setEditLeave(leave);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => {
    try {
      if (editLeave) {
        updateLeave(editLeave.id, data);
      } else {
        addLeave(data);
      }
    } catch {
      // Error handled inside store with toast
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      try {
        deleteLeave(deleteTarget.id);
      } catch {
        // Error handled inside store
      }
      setDeleteTarget(null);
    }
  };

  const handleApprove = (leave: LeaveRequest) => {
    try {
      approveLeave(leave.id, user?.name ?? 'System');
    } catch {
      // Error handled inside store
    }
  };

  const handleReject = (leave: LeaveRequest) => {
    try {
      rejectLeave(leave.id);
    } catch {
      // Error handled inside store
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Leave Requests</h1>
          <p className="text-sm text-[#A3A3A3]">Manage employee leave filings and approvals</p>
        </div>
        {hasPermission('leaves:create') && (
          <Button className="gap-2" onClick={handleAdd}>
            <Plus size={16} />
            File Leave
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: leaves.filter(l => l.status === 'pending').length, status: 'pending' as const },
          { label: 'Approved', count: leaves.filter(l => l.status === 'approved').length, status: 'approved' as const },
          { label: 'Rejected', count: leaves.filter(l => l.status === 'rejected').length, status: 'rejected' as const },
          { label: 'Total', count: leaves.length, status: 'default' as const },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#FAFAFA]">{item.count}</p>
              <Badge variant={item.status} className="mt-1">{item.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leave Request Cards */}
      <div className="space-y-4">
        {leaves.map((leave) => (
          <Card key={leave.id} className="hover:border-brand-primary/20 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold flex-shrink-0">
                    {leave.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#FAFAFA]">{leave.employeeName}</p>
                      <Badge variant={leave.status}>{leave.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#A3A3A3]">
                      <span className="flex items-center gap-1 capitalize">
                        <FileText size={12} />
                        {leave.type} Leave
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(leave.startDate)} — {formatDate(leave.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-[#A3A3A3]">{leave.reason}</p>
                    {leave.approvedBy && (
                      <p className="text-xs text-green-400">Approved by {leave.approvedBy}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {leave.status === 'pending' && hasPermission('leaves:approve') && (
                    <>
                      <Button size="sm" className="gap-1" onClick={() => handleApprove(leave)}>
                        <Check size={14} />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleReject(leave)}>
                        <X size={14} />
                        Reject
                      </Button>
                    </>
                  )}
                  {leave.status === 'pending' && (
                    <button
                      onClick={() => handleEdit(leave)}
                      className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                  )}
                  {hasPermission('leaves:delete') && (
                    <button
                      onClick={() => setDeleteTarget(leave)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {leaves.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-[#A3A3A3]">
              No leave requests found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <LeaveFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        leave={editLeave}
        employeeNames={employeeNames}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Leave Request"
        message={`Are you sure you want to delete the leave request for ${deleteTarget?.employeeName}?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
