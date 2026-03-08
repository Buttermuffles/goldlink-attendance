import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'on-time' | 'late' | 'absent' | 'on-leave' | 'half-day' | 'holiday' | 'overtime' | 'pending' | 'approved' | 'rejected' | 'draft' | 'finalized' | 'disbursed' | 'active' | 'resigned';
}

const variantStyles: Record<string, string> = {
  default: 'bg-[rgb(55,55,55)] text-[#FAFAFA]',
  'on-time': 'bg-green-500/20 text-green-400 border-green-500/30',
  late: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  absent: 'bg-red-500/20 text-red-400 border-red-500/30',
  'on-leave': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'half-day': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  holiday: 'bg-brand-deep/20 text-brand-highlight border-brand-deep/30',
  overtime: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  finalized: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  disbursed: 'bg-green-500/20 text-green-400 border-green-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  resigned: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function Badge({ className, variant = 'default', ...props }: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors',
        variantStyles[variant] ?? variantStyles['default'],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps };
