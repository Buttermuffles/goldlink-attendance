import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Bell, Clock, Search, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClockInModal } from '@/components/shared/ClockInModal';

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export function TopBar({ onMobileMenuToggle }: TopBarProps): React.ReactElement {
  const { user } = useAuthStore();
  const [clockModalOpen, setClockModalOpen] = useState(false);
  const [clockMode, setClockMode] = useState<'clock-in' | 'clock-out'>('clock-in');
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

  const openClockIn = () => {
    setClockMode('clock-in');
    setClockModalOpen(true);
  };

  const openClockOut = () => {
    setClockMode('clock-out');
    setClockModalOpen(true);
  };

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

          {/* Clock In / Clock Out buttons */}
          <Button
            size="sm"
            onClick={openClockIn}
            className="gap-1.5"
          >
            <Clock size={14} />
            <span className="hidden sm:inline">Clock In</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={openClockOut}
            className="gap-1.5"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Clock Out</span>
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

      {/* Clock In/Out Modal with RFID, Manual, Photo Recognition + Selfie */}
      <ClockInModal
        open={clockModalOpen}
        onClose={() => setClockModalOpen(false)}
        mode={clockMode}
      />
    </>
  );
}
