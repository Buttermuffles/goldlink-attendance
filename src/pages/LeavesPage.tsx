import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockLeaveRequests } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { FileText, Check, X, Plus, Calendar } from 'lucide-react';

export function LeavesPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Leave Requests</h1>
          <p className="text-sm text-[#A3A3A3]">Manage employee leave filings and approvals</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          File Leave
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: mockLeaveRequests.filter(l => l.status === 'pending').length, status: 'pending' as const },
          { label: 'Approved', count: mockLeaveRequests.filter(l => l.status === 'approved').length, status: 'approved' as const },
          { label: 'Rejected', count: mockLeaveRequests.filter(l => l.status === 'rejected').length, status: 'rejected' as const },
          { label: 'Total', count: mockLeaveRequests.length, status: 'default' as const },
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
        {mockLeaveRequests.map((leave) => (
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

                {leave.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="gap-1">
                      <Check size={14} />
                      Approve
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1">
                      <X size={14} />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
