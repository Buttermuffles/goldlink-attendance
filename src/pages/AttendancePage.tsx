import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useAuthStore } from '@/stores/authStore';
import { AttendanceFormModal } from '@/components/modals/AttendanceFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatTime } from '@/lib/utils';
import type { AttendanceRecord } from '@/types';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  MapPin,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

export function AttendancePage(): React.ReactElement {
  const { records, addRecord, updateRecord, deleteRecord } = useAttendanceStore();
  const { employees } = useEmployeeStore();
  const { hasPermission } = useAuthStore();
  const [dateFilter, setDateFilter] = useState('2026-03-08');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null);

  const filteredRecords = records.filter((rec) => {
    const matchesDate = rec.date === dateFilter;
    const matchesStatus = !statusFilter || rec.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const statusCounts = records.reduce(
    (acc, rec) => {
      acc[rec.status] = (acc[rec.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const employeeNames = employees.map((e) => ({
    label: `${e.firstName} ${e.lastName}`,
    value: e.id,
    name: `${e.firstName} ${e.lastName}`,
  }));

  const handleAdd = () => {
    setEditRecord(null);
    setShowFormModal(true);
  };

  const handleEdit = (rec: AttendanceRecord) => {
    setEditRecord(rec);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: Omit<AttendanceRecord, 'id'>) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Attendance</h1>
          <p className="text-sm text-[#A3A3A3]">Daily attendance monitoring dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          {hasPermission('attendance:create') && (
            <Button className="gap-2" onClick={handleAdd}>
              <Plus size={16} />
              Add Record
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'On Time', status: 'on-time', count: statusCounts['on-time'] ?? 0 },
          { label: 'Late', status: 'late', count: statusCounts['late'] ?? 0 },
          { label: 'Absent', status: 'absent', count: statusCounts['absent'] ?? 0 },
          { label: 'On Leave', status: 'on-leave', count: statusCounts['on-leave'] ?? 0 },
          { label: 'Half Day', status: 'half-day', count: statusCounts['half-day'] ?? 0 },
          { label: 'Overtime', status: 'overtime', count: statusCounts['overtime'] ?? 0 },
        ].map((item) => (
          <Card key={item.status} className="cursor-pointer hover:border-brand-primary/30 transition-colors">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#FAFAFA]">{item.count}</p>
              <Badge variant={item.status as AttendanceRecord['status']} className="mt-1">
                {item.label}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#A3A3A3]" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 rounded-md border border-[rgb(55,55,55)] bg-[rgb(36,36,36)] px-3 text-sm text-[#FAFAFA]"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { label: 'All Status', value: '' },
                { label: 'On Time', value: 'on-time' },
                { label: 'Late', value: 'late' },
                { label: 'Absent', value: 'absent' },
                { label: 'On Leave', value: 'on-leave' },
                { label: 'Half Day', value: 'half-day' },
              ]}
            />
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Attendance Records — {dateFilter}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(55,55,55)]">
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Employee</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Clock In</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden md:table-cell">Clock Out</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">Hours</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">OT</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Status</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden sm:table-cell">Flags</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-[rgb(55,55,55)] hover:bg-[rgb(26,26,26)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold flex-shrink-0">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-sm font-medium text-[#FAFAFA]">{record.employeeName}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-[#FAFAFA]">
                        {record.clockIn ? formatTime(record.clockIn) : '—'}
                      </p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm text-[#FAFAFA]">
                        {record.clockOut ? formatTime(record.clockOut) : '—'}
                      </p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm text-[#FAFAFA]">{record.hoursWorked}h</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm text-brand-primary">{record.overtimeHours > 0 ? `+${record.overtimeHours}h` : '—'}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={record.status}>{record.status.replace('-', ' ')}</Badge>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {record.locationMismatch && (
                          <span className="flex items-center gap-1 text-xs text-amber-400" title="Location Mismatch">
                            <AlertTriangle size={12} />
                            <MapPin size={12} />
                          </span>
                        )}
                        {record.clockInLocation && (
                          <span className="text-xs text-green-400" title="GPS Verified">
                            <MapPin size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('attendance:update') && (
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {hasPermission('attendance:delete') && (
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
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#A3A3A3]">
                      No attendance records for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <AttendanceFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        record={editRecord}
        employeeNames={employeeNames}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Attendance Record"
        message={`Are you sure you want to delete the attendance record for ${deleteTarget?.employeeName}?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
