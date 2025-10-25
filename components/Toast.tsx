import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, CancelIcon, WarningIcon, InfoIcon, CloseIcon } from './icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss: (id: string) => void;
}

const toastIcons: Record<ToastType, React.FC<{className?: string}>> = {
  success: CheckCircleIcon,
  error: CancelIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const toastStyles: Record<ToastType, { container: string; progress: string }> = {
  success: {
    container: 'bg-green-600',
    progress: 'bg-green-400',
  },
  error: {
    container: 'bg-red-600',
    progress: 'bg-red-400',
  },
  warning: {
    container: 'bg-orange-500',
    progress: 'bg-orange-300',
  },
  info: {
    container: 'bg-blue-600',
    progress: 'bg-blue-400',
  },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    const interval = setInterval(() => {
        setProgress(prev => {
            const next = prev - (100 / (duration / 100));
            if (next <= 0) {
                clearInterval(interval);
                return 0;
            }
            return next;
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [id, duration, onDismiss]);

  const Icon = toastIcons[type];
  const styles = toastStyles[type];

  return (
    <div className={`flex items-center w-full max-w-sm p-4 mb-4 text-white rounded-lg shadow-lg relative overflow-hidden ${styles.container}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 focus:ring-white/50"
        aria-label="Cerrar"
        onClick={() => onDismiss(id)}
      >
        <span className="sr-only">Cerrar</span>
        <CloseIcon className="w-5 h-5" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className={styles.progress} style={{ width: `${progress}%`, height: '100%', transition: 'width 100ms linear' }}></div>
      </div>
    </div>
  );
};

export default Toast;