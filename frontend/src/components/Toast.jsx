import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slideUp">
      <div
        className={`flex items-center justify-between p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
          isSuccess
            ? 'bg-[#152238]/95 border-[#16BFD0]/50 text-[#F1F7FF] shadow-glow-cyan'
            : isError
            ? 'bg-red-950/95 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : 'bg-[#152238]/95 border-[#263B58] text-[#F1F7FF]'
        }`}
      >
        <div className="flex items-center space-x-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#16BFD0] flex-shrink-0 animate-bounce" />}
          {isError && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-[#6FA8FF] flex-shrink-0" />}

          <div>
            <p className="text-xs sm:text-sm font-semibold">{toast.title || (isSuccess ? 'Copied Successfully!' : 'Notification')}</p>
            {toast.message && (
              <p className="text-xs text-[#A9B8CC] mt-0.5">{toast.message}</p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-lg text-[#A9B8CC] hover:text-[#F1F7FF] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
