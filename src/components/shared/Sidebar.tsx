import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  Users,
  Clock,
  MapPin,
  DollarSign,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'hr', 'supervisor', 'employee'] },
  { title: 'Employees', href: '/employees', icon: <Users size={20} />, roles: ['admin', 'hr', 'supervisor'] },
  { title: 'Attendance', href: '/attendance', icon: <Clock size={20} />, roles: ['admin', 'hr', 'supervisor', 'employee'] },
  { title: 'Map Tracking', href: '/map', icon: <MapPin size={20} />, roles: ['admin', 'hr', 'supervisor'] },
  { title: 'Payroll', href: '/payroll', icon: <DollarSign size={20} />, roles: ['admin', 'hr'] },
  { title: 'Leave Requests', href: '/leaves', icon: <FileText size={20} />, roles: ['admin', 'hr', 'supervisor', 'employee'] },
  { title: 'Reports', href: '/reports', icon: <BarChart3 size={20} />, roles: ['admin', 'hr'] },
  { title: 'Settings', href: '/settings', icon: <Settings size={20} />, roles: ['admin'] },
];

export function Sidebar(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const filteredNav = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[rgb(36,36,36)] border-r border-[rgb(55,55,55)] transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgb(55,55,55)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-primary/20">
          <Shield className="text-brand-primary" size={20} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-[#FAFAFA] truncate">GoldLink Infratek</h1>
            <p className="text-[10px] text-[#A3A3A3] truncate">ARIA Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-primary/15 text-brand-primary'
                  : 'text-[#A3A3A3] hover:bg-[rgb(55,55,55)] hover:text-[#FAFAFA]'
              )}
              title={collapsed ? item.title : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[rgb(55,55,55)] p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-[#1A1A1A] text-xs font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-[#FAFAFA] truncate">{user.name}</p>
              <p className="text-[10px] text-[#A3A3A3] uppercase">{user.role}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
            title="Logout"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
