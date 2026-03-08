import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDashboardStats, mockAttendance, mockLeaveRequests } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarOff,
  FileText,
  DollarSign,
  MapPin,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  color: string;
}

function StatCard({ title, value, icon, change, color }: StatCardProps): React.ReactElement {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[#A3A3A3]">{title}</p>
            <p className="text-2xl font-bold text-[#FAFAFA]">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <ArrowUpRight size={12} />
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center justify-center w-11 h-11 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
            <span style={{ color }}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage(): React.ReactElement {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Dashboard</h1>
        <p className="text-sm text-[#A3A3A3]">Welcome back to the ARIA Platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users size={20} />} color="#FB923C" change="+2 this month" />
        <StatCard title="Present Today" value={stats.presentToday} icon={<UserCheck size={20} />} color="#22c55e" />
        <StatCard title="Absent Today" value={stats.absentToday} icon={<UserX size={20} />} color="#ef4444" />
        <StatCard title="Late Today" value={stats.lateToday} icon={<Clock size={20} />} color="#f59e0b" />
        <StatCard title="On Leave" value={stats.onLeaveToday} icon={<CalendarOff size={20} />} color="#3b82f6" />
        <StatCard title="Pending Leaves" value={stats.pendingLeaves} icon={<FileText size={20} />} color="#a855f7" />
        <StatCard title="Payroll This Month" value={formatCurrency(stats.totalPayrollThisMonth)} icon={<DollarSign size={20} />} color="#FF9B2E" />
        <StatCard title="Active Worksites" value={stats.activeWorksites} icon={<MapPin size={20} />} color="#06b6d4" />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today's Attendance</CardTitle>
              <TrendingUp size={16} className="text-[#A3A3A3]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAttendance.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-[rgb(55,55,55)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold">
                      {record.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#FAFAFA]">{record.employeeName}</p>
                      <p className="text-xs text-[#A3A3A3]">
                        {record.clockIn
                          ? new Date(record.clockIn).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' })
                          : 'No clock-in'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={record.status}>{record.status.replace('-', ' ')}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Leave Requests</CardTitle>
              <FileText size={16} className="text-[#A3A3A3]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLeaveRequests.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between py-2 border-b border-[rgb(55,55,55)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                      {leave.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#FAFAFA]">{leave.employeeName}</p>
                      <p className="text-xs text-[#A3A3A3] capitalize">{leave.type} · {leave.startDate}</p>
                    </div>
                  </div>
                  <Badge variant={leave.status}>{leave.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
