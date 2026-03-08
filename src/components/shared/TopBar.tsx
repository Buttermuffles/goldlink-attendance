import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Bell, Clock, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps): React.ReactElement {
  const { user } = useAuthStore();
  const [clockInOpen, setClockInOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-[rgb(55,55,55)] bg-[rgb(36,36,36)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)]"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[rgb(26,26,26)] border border-[rgb(55,55,55)] rounded-lg px-3 py-1.5 w-72">
            <Search size={16} className="text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Search employees, records..."
              className="bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#A3A3A3] outline-none w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time display */}
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-mono font-bold text-brand-primary">{timeString}</span>
            <span className="text-[10px] text-[#A3A3A3]">{dateString}</span>
          </div>

          {/* Quick clock-in button */}
          <Button
            size="sm"
            onClick={() => setClockInOpen(true)}
            className="gap-1.5"
          >
            <Clock size={14} />
            <span className="hidden sm:inline">Clock In</span>
          </Button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-[#A3A3A3] hover:bg-[rgb(55,55,55)] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full" />
          </button>

          {/* User avatar */}
          {user && (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary text-[#1A1A1A] text-xs font-bold cursor-pointer" title={user.name}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
      </header>

      {/* Clock-In Dialog */}
      <Dialog open={clockInOpen} onClose={() => setClockInOpen(false)}>
        <DialogHeader>
          <DialogTitle>Quick Clock In</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center py-6">
            <p className="text-4xl font-mono font-bold text-brand-primary">{timeString}</p>
            <p className="text-sm text-[#A3A3A3] mt-2">{dateString}</p>
          </div>
          <div className="bg-[rgb(26,26,26)] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Employee:</span>
              <span className="text-[#FAFAFA]">{user?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Location:</span>
              <span className="text-[#FAFAFA]">Detecting GPS...</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => setClockInOpen(false)}>
              <Clock size={16} className="mr-2" />
              Clock In Now
            </Button>
            <Button variant="outline" onClick={() => setClockInOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
