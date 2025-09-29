import React, { useState, useRef, useEffect } from 'react';
import { Visit, VisitStatus } from '../types';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';

interface VisitActionsProps {
  visit: Visit;
  onViewVisit: (visitId: string) => void;
  onScheduleVisit: (visitId: string) => void;
}

const VisitActions: React.FC<VisitActionsProps> = ({ visit, onViewVisit, onScheduleVisit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const renderActions = () => {
    const viewButton = (
      <button 
        onClick={() => handleActionClick(() => onViewVisit(visit.id))} 
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
        role="menuitem"
      >
        Ver visita
      </button>
    );
    
    const scheduleButton = (
        <button
          onClick={() => handleActionClick(() => onScheduleVisit(visit.id))}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          {visit.scheduledDate ? 'Reprogramar visita' : 'Programar visita'}
        </button>
    );


    switch (visit.status) {
      case VisitStatus.Pendiente:
      case VisitStatus.Programada:
      case VisitStatus.Reprogramada:
        return (
          <>
            {viewButton}
            {scheduleButton}
            {visit.status === VisitStatus.Pendiente && (
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">Rechazar visita</a>
            )}
          </>
        );
      case VisitStatus.Fallida:
        return (
          <>
            {viewButton}
          </>
        );
      case VisitStatus.Realizada:
        return (
          <>
            {viewButton}
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Descargar acta de visita</a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          type="button"
          className="flex items-center p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-secondary"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Opciones de visita"
        >
          <span className="sr-only">Opciones</span>
          <DotsVerticalIcon className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {renderActions()}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitActions;