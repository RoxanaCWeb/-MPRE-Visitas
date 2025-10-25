import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { ToastType } from './Toast';

interface RejectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  showToast: (message: string, type: ToastType) => void;
}

const RejectionDrawer: React.FC<RejectionDrawerProps> = ({ isOpen, onClose, onConfirm, showToast }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(''); // Reset reason when drawer opens
    }
  }, [isOpen]);

  const handleConfirmClick = () => {
    if (reason.trim()) {
      onConfirm(reason);
    } else {
      showToast('Por favor, ingrese un motivo para el rechazo.', 'warning');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-surface shadow-2xl z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rejection-drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <h2 id="rejection-drawer-title" className="text-xl font-semibold text-text-primary">
              Rechazar Visita
            </h2>
            <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-background-alt" aria-label="Cerrar">
              <XIcon className="h-6 w-6" />
            </button>
          </header>

          {/* Content */}
          <main className="flex-grow p-6 space-y-4">
            <p className="text-text-secondary">
              Por favor, ingrese el motivo por el cual rechaza esta visita. Esta información es importante para el equipo de Backoffice.
            </p>
            <div>
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-text-primary mb-1">
                Motivo del rechazo <span className="text-status-error-text">*</span>
              </label>
              <textarea
                id="rejection-reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="p-2 border border-border-strong rounded-md w-full bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="Ej: Fuera de mi zona de cobertura, conflicto de especialidad, etc."
              />
            </div>
          </main>

          {/* Footer */}
          <footer className="flex justify-end p-4 border-t bg-background">
            <button
              onClick={onClose}
              className="px-5 py-2 text-text-primary rounded-md hover:bg-background-alt transition-colors mr-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmClick}
              className="px-5 py-2 bg-status-error-bg text-status-error-text border border-status-error-border rounded-md hover:bg-status-error-text hover:text-text-on-primary transition-colors disabled:bg-text-disabled disabled:text-text-secondary disabled:border-border disabled:cursor-not-allowed"
            >
              Confirmar Rechazo
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};

export default RejectionDrawer;