import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/XIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface ScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string) => void;
  visitCount: number;
}

const ScheduleDrawer: React.FC<ScheduleDrawerProps> = ({ isOpen, onClose, onSchedule, visitCount }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');

    useEffect(() => {
        // Set default date to today when drawer opens
        if (isOpen) {
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (selectedDate) {
            onSchedule(selectedDate);
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
                className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="schedule-drawer-title"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 border-b">
                        <h2 id="schedule-drawer-title" className="text-xl font-semibold text-primary">
                            Programar Visita{visitCount > 1 ? 's' : ''}
                        </h2>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Cerrar panel de programación">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </header>
                    
                    {/* Content */}
                    <div className="flex-grow p-6 space-y-6">
                        <p className="text-gray-600">
                            Seleccione la fecha en la que planea realizar {visitCount > 1 ? `las ${visitCount} visitas seleccionadas` : 'la visita seleccionada'}.
                        </p>
                        <div>
                            <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha Programada
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    id="schedule-date"
                                    name="schedule-date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="p-2 pl-10 border border-gray-300 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
                                    min={new Date().toISOString().split('T')[0]} // Cannot schedule for the past
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="flex justify-end p-4 border-t bg-gray-50">
                        <button onClick={onClose} className="px-5 py-2 text-primary rounded-md hover:bg-gray-200 transition-colors mr-2">
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={!selectedDate}
                            className="px-5 py-2 bg-secondary text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Guardar
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default ScheduleDrawer;