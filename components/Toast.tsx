import React, { useEffect, useState } from 'react';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ToastProps {
  message?: string | null;
  type?: 'success' | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && type) {
      setIsVisible(true);
      // The parent component handles the timeout for hiding the toast logically
      // This timeout is just for the exit animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2700); // Start hiding animation slightly before logical removal
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, type]);

  if (!message || !type) {
    return null;
  }

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  };

  const baseClasses = "fixed top-5 right-5 z-50 flex items-center p-4 w-full max-w-xs rounded-lg shadow-lg bg-white border-l-4 transition-all duration-300 ease-in-out";
  const typeClasses = {
    success: 'border-green-500',
  };
  const animationClasses = isVisible ? 'transform-none opacity-100' : 'translate-x-full opacity-0';

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${animationClasses}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 mr-4 text-sm font-normal text-gray-700">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <span className="sr-only">Cerrar</span>
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
