import { CheckCircle, XCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white min-w-[280px] ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.type === 'error'
            ? <XCircle size={20} className="shrink-0" />
            : <CheckCircle size={20} className="shrink-0" />
          }
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="shrink-0 hover:opacity-70 transition-opacity">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
