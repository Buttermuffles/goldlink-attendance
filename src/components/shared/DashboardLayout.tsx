import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

export function DashboardLayout(): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A1A1A]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[260px]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6',
            'bg-[#1A1A1A]'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
