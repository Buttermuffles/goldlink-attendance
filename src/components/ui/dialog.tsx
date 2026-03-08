import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Dialog({ open, onClose, children }: DialogProps): React.ReactElement | null {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-[rgb(55,55,55)] bg-[rgb(36,36,36)] p-6 shadow-xl" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('mb-4 space-y-1.5', className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return <h2 className={cn('text-lg font-semibold text-[#FAFAFA]', className)} {...props} />;
}

export { Dialog, DialogHeader, DialogTitle };
