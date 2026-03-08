import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useAuthStore } from '@/stores/authStore';
import { EmployeeFormModal } from '@/components/modals/EmployeeFormModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DEPARTMENTS } from '@/constants';
import type { Employee } from '@/types';
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

export function EmployeesPage(): React.ReactElement {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployeeStore();
  const { hasPermission } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName} ${emp.employeeId} ${emp.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesDept = !departmentFilter || emp.department === departmentFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleViewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowDetailDialog(true);
  };

  const handleAdd = () => {
    setEditEmployee(null);
    setShowFormModal(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editEmployee) {
        updateEmployee(editEmployee.id, data);
      } else {
        addEmployee(data);
      }
    } catch {
      // Error handled inside store with toast
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      try {
        deleteEmployee(deleteTarget.id);
      } catch {
        // Error handled inside store with toast
      }
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Employees</h1>
          <p className="text-sm text-[#A3A3A3]">{employees.length} total employees</p>
        </div>
        {hasPermission('employees:create') && (
          <Button className="gap-2" onClick={handleAdd}>
            <Plus size={16} />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
              <Input
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                options={[
                  { label: 'All Departments', value: '' },
                  ...DEPARTMENTS.map((d) => ({ label: d, value: d })),
                ]}
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Status', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'On Leave', value: 'on-leave' },
                  { label: 'Resigned', value: 'resigned' },
                ]}
              />
              <Button variant="outline" size="icon" title="More Filters">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgb(55,55,55)]">
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Employee</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden md:table-cell">Department</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden lg:table-cell">Position</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4 hidden sm:table-cell">Site</th>
                  <th className="text-left text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-medium text-[#A3A3A3] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-[rgb(55,55,55)] hover:bg-[rgb(26,26,26)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold flex-shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#FAFAFA]">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-[#A3A3A3]">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm text-[#FAFAFA]">{emp.department}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <p className="text-sm text-[#FAFAFA]">{emp.position}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-sm text-[#A3A3A3]">
                        <MapPin size={12} />
                        <span>{emp.siteAssignment}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={emp.status === 'active' ? 'active' : emp.status === 'on-leave' ? 'on-leave' : 'resigned'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewEmployee(emp)}
                          className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {hasPermission('employees:update') && (
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {hasPermission('employees:delete') && (
                          <button
                            onClick={() => setDeleteTarget(emp)}
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
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#A3A3A3]">
                      No employees found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Detail Dialog */}
      <Dialog open={showDetailDialog} onClose={() => setShowDetailDialog(false)}>
        {selectedEmployee && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedEmployee.firstName} {selectedEmployee.lastName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/20 text-brand-primary text-xl font-bold">
                  {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#FAFAFA]">{selectedEmployee.position}</p>
                  <p className="text-sm text-[#A3A3A3]">{selectedEmployee.department}</p>
                  <Badge variant={selectedEmployee.status === 'active' ? 'active' : 'resigned'} className="mt-1">
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 bg-[rgb(26,26,26)] rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-[#A3A3A3]" />
                  <span className="text-[#FAFAFA]">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-[#A3A3A3]" />
                  <span className="text-[#FAFAFA]">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-[#A3A3A3]" />
                  <span className="text-[#FAFAFA]">{selectedEmployee.siteAssignment}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs text-[#A3A3A3]">Employee ID</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm font-medium text-[#FAFAFA]">{selectedEmployee.employeeId}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs text-[#A3A3A3]">Daily Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm font-medium text-brand-primary">₱{selectedEmployee.dailyRate.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetailDialog(false)}>Close</Button>
                {hasPermission('employees:update') && (
                  <Button className="flex-1" onClick={() => { setShowDetailDialog(false); handleEdit(selectedEmployee); }}>
                    Edit Employee
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Dialog>

      {/* Create/Edit Modal */}
      <EmployeeFormModal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={editEmployee}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
