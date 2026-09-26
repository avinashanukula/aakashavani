import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Bell, AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toastList, removeToast } = useAuth();

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toastList.map((toast) => {
        const isApproval = toast.type === 'approval';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-[#141413] text-white border-l-4 border-[#E5182B] shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200"
          >
            <div className="mt-0.5 shrink-0">
              {isApproval ? (
                <ShieldCheck size={20} className="text-[#E5182B]" />
              ) : isSuccess ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
              ) : (
                <Bell size={20} className="text-[#E5182B]" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A19F97]">
                  {isApproval ? 'CLEARANCE DISPATCH' : 'SYSTEM NOTICE'}
                </span>
                <span className="text-[10px] font-mono text-[#87857F]">{toast.timestamp}</span>
              </div>
              <h4 className="text-sm font-semibold text-[#FAF8F5] leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-[#C5C2BA] leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#87857F] hover:text-white transition-colors p-1 cursor-pointer shrink-0"
              title="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
