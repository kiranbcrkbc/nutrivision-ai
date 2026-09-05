import React from 'react';
import { useToastStore } from '../../services/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/80',
    error: 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/80',
    warning: 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800/80',
    info: 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-800/80',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${bgStyles[toast.type]} transition-all duration-200 animate-slideUp`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h5>
            {toast.message && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
