import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockAttendance, mockPayroll, mockEmployees } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';

export function ReportsPage(): React.ReactElement {
  const totalPayroll = mockPayroll.reduce((sum, p) => sum + p.netPay, 0);
  const avgHours = mockAttendance.reduce((sum, a) => sum + a.hoursWorked, 0) / Math.max(mockAttendance.length, 1);
  const lateCount = mockAttendance.filter(a => a.status === 'late').length;
  const presentCount = mockAttendance.filter(a => a.status === 'on-time').length;

  const reportCards = [
    {
      title: 'Attendance Summary',
      description: 'Daily, weekly, and monthly attendance statistics',
      icon: <Calendar size={24} />,
      stats: [
        { label: 'Present', value: presentCount.toString() },
        { label: 'Late', value: lateCount.toString() },
        { label: 'Avg Hours', value: `${avgHours.toFixed(1)}h` },
      ],
    },
    {
      title: 'Payroll Summary',
      description: 'Payroll costs, deductions, and disbursement overview',
      icon: <TrendingUp size={24} />,
      stats: [
        { label: 'Total Net', value: formatCurrency(totalPayroll) },
        { label: 'Records', value: mockPayroll.length.toString() },
        { label: 'Avg Pay', value: formatCurrency(totalPayroll / Math.max(mockPayroll.length, 1)) },
      ],
    },
    {
      title: 'Employee Reports',
      description: 'Headcount, department breakdown, and status reports',
      icon: <Users size={24} />,
      stats: [
        { label: 'Total', value: mockEmployees.length.toString() },
        { label: 'Active', value: mockEmployees.filter(e => e.status === 'active').length.toString() },
        { label: 'Departments', value: new Set(mockEmployees.map(e => e.department)).size.toString() },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Reports & Analytics</h1>
          <p className="text-sm text-[#A3A3A3]">Generate and export operational reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((report) => (
          <Card key={report.title} className="hover:border-brand-primary/30 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-primary/20 text-brand-primary">
                  {report.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">{report.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {report.stats.map((stat) => (
                  <div key={stat.label} className="text-center py-2 bg-[rgb(26,26,26)] rounded-lg">
                    <p className="text-sm font-bold text-[#FAFAFA]">{stat.value}</p>
                    <p className="text-[10px] text-[#A3A3A3]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Attendance Trend (Last 7 Days)</CardTitle>
            <BarChart3 size={16} className="text-[#A3A3A3]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {/* Simple bar chart visualization */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const height = [75, 88, 92, 68, 95, 30, 10][i] ?? 50;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full max-w-[40px] relative rounded-t-md overflow-hidden" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-brand-deep opacity-80" />
                  </div>
                  <span className="text-[10px] text-[#A3A3A3]">{day}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
