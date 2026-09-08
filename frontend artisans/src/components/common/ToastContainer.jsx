import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts = [], removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon toast-icon-success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon toast-icon-error" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon toast-icon-warning" size={20} />;
      case 'info':
      default:
        return <Info className="toast-icon toast-icon-info" size={20} />;
    }
  };

  return (
    <aside aria-label="Notifications" className="karigar-toast-container">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`karigar-toast-item karigar-toast-${toast.type || 'info'}`}
        >
          <div className="toast-icon-wrap">
            {getIcon(toast.type)}
          </div>
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button 
            type="button"
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </aside>
  );
}
