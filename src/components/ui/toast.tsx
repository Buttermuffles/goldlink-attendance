import React from 'react';
import { useToastStore, type ToastVariant } from '@/stores/toastStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const VARIANT_STYLES: Record<ToastVariant, { bg: string; border: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: <CheckCircle size={18} className="text-green-400" />,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: <XCircle size={18} className="text-red-400" />,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: <AlertTriangle size={18} className="text-yellow-400" />,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: <Info size={18} className="text-blue-400" />,
  },
};

export function ToastContainer(): React.ReactElement {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const style = VARIANT_STYLES[t.variant];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border ${style.border} ${style.bg} bg-[rgb(36,36,36)] shadow-lg animate-slide-in`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#FAFAFA]">{t.title}</p>
              {t.message && <p className="text-xs text-[#A3A3A3] mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-[rgb(55,55,55)] text-[#A3A3A3]"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
