import React, { useState, useRef, PropsWithChildren, FormEvent } from 'react';
import { Visit } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import SignaturePad from './SignaturePad';
import { DownloadIcon } from './icons/DownloadIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { TrashIcon } from './icons/TrashIcon';
import Select from './Select';
import { ToastType } from './Toast';

type FormFieldProps = {
  label: string;
  required?: boolean;
  className?: string;
};

// FIX: Changed component signature to use PropsWithChildren to correctly type component with children.
const FormField = ({ label, children, required = false, className = '' }: PropsWithChildren<FormFieldProps>) => (
  <div className={className}>
    <label className="block text-sm font-medium text-text-primary mb-1">
      {label} {required && <span className="text-status-error-text">*</span>}
    </label>
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string, value: string | React.ReactNode }> = ({ label, value }) => (
    <div>
      <p className="text-sm font-bold text-text-primary">{label}</p>
      <p className="text-sm text-text-secondary">{value}</p>
    </div>
);

interface VisitDetailScreenProps {
    visit: Visit;
    onBack: () => void;
    onSave: (reportData: Partial<Visit> & { id: string }) => void;
    isReadOnly?: boolean;
    showToast: (message: string, type: ToastType) => void;
}

const VisitDetailScreen: React.FC<VisitDetailScreenProps> = ({ visit, onBack, onSave, isReadOnly = false, showToast }) => {
    const higSeguridadOptions = ['Servicio Interno', 'Servicio Externo'].map(o => ({ value: o, label: o }));
    const visitTypeOptions = ['Asesoramiento', 'Capacitación', 'Mediciones', 'Auditoría'].map(o => ({ value: o, label: o }));

    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    const [visitDate, setVisitDate] = useState<string>(visit.visitDate || new Date().toISOString().split('T')[0]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setAttachedFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setAttachedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    const handleDownloadFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const baseInputClasses = `p-2 border border-border-strong rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary text-text-primary ${isReadOnly ? 'bg-background-alt cursor-not-allowed' : 'bg-surface'}`;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;
        
        const form = formRef.current;
        if (!form) return;

        const invalidElement = form.querySelector(':invalid') as HTMLElement;
        
        if (invalidElement) {
            showToast('Por favor, complete todos los campos obligatorios (*).', 'warning');
            invalidElement.focus();
            return;
        }

        const reportData = {
            id: visit.id,
            visitDate: visitDate,
        };
        onSave(reportData);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-full">
            <header className="mb-6">
                <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-text-primary hover:text-primary" aria-label="Volver a la lista de visitas">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Volver a Mis Visitas
                </button>
            </header>

            {/* Visit Details Header Card */}
            <div className="bg-surface p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h1 className="text-2xl font-bold text-text-primary">Detalle visita: {visit.establishment}</h1>
                    <button className="flex-shrink-0 px-4 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary-lightest transition-colors w-full sm:w-auto">
                        Sobre el establecimiento
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-6 border-t pt-4">
                    <InfoItem label="Tipo de visita" value={visit.visitType} />
                    <InfoItem label="Fecha límite" value={visit.deadlineDate} />
                    <InfoItem label="Fecha de visita" value={visit.visitDate || 'N/A'} />
                    <InfoItem label="Preventor" value={visit.preventor} />
                    <InfoItem label="Observaciones" value={visit.observations || 'N/A'} />
                </div>
            </div>

            {/* Visit Report Form Card */}
            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-text-primary mb-6 border-b pb-4">Acta de visita</h2>
                <form onSubmit={handleSubmit} noValidate ref={formRef}>
                    <fieldset disabled={isReadOnly} className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <div className="md:col-span-6 flex items-center">
                            <input type="checkbox" id="fallo-visita" className="h-4 w-4 text-primary border-border-strong rounded focus:ring-primary disabled:bg-background-alt" />
                            <label htmlFor="fallo-visita" className="ml-2 block text-sm text-text-primary">
                                ¿Fallo la visita?
                            </label>
                        </div>
                        
                        <FormField label="Fecha de Realización" required className="md:col-span-2">
                           <input 
                             type="date" 
                             className={baseInputClasses} 
                             value={visitDate}
                             onChange={(e) => setVisitDate(e.target.value)}
                             required 
                           />
                        </FormField>

                        <div className="md:col-span-4" /> {/* Spacer */}
                        
                        <FormField label="Dotación total del personal" required className="md:col-span-2">
                            <input type="number" className={baseInputClasses} required />
                        </FormField>
                        
                        <FormField label="Administrativos" required className="md:col-span-2">
                            <input type="number" className={baseInputClasses} required />
                        </FormField>
                        
                        <FormField label="Personal de Producción" required className="md:col-span-2">
                            <input type="number" className={baseInputClasses} required />
                        </FormField>

                        <FormField label="Ser. Hig y Seguridad" required className="md:col-span-2">
                             <Select
                                id="higSeguridad"
                                options={higSeguridadOptions}
                                placeholder="Seleccione..."
                                required
                                disabled={isReadOnly}
                            />
                        </FormField>

                        <FormField label="Profesional" required className="md:col-span-2">
                            <input type="text" className={baseInputClasses} required />
                        </FormField>
                        
                        <FormField label="Matricula" required className="md:col-span-2">
                            <input type="text" className={baseInputClasses} required />
                        </FormField>

                        <FormField label="Tipo de visita" required className="md:col-span-6">
                            <Select
                                id="visitType"
                                options={visitTypeOptions}
                                placeholder="Seleccione..."
                                required
                                disabled={isReadOnly}
                            />
                        </FormField>

                        <FormField label="Observación" required className="md:col-span-6">
                            <textarea rows={4} className={baseInputClasses} required></textarea>
                        </FormField>
                    </fieldset>

                    {/* Attachment Section */}
                    <div className="md:col-span-6 space-y-4 pt-2 mt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                            <button 
                                type="button" 
                                onClick={() => alert('Función para descargar PDF no implementada.')}
                                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-border-strong text-text-primary rounded-md text-sm font-medium hover:bg-background-alt transition-colors"
                            >
                                <DownloadIcon className="h-5 w-5 mr-2" />
                                Descargar Acta en PDF
                            </button>
                            {!isReadOnly && (
                                <>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    multiple 
                                    accept=".pdf,.jpg,.jpeg,.png" 
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAttachClick} 
                                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary-lightest transition-colors"
                                >
                                    <PaperClipIcon className="h-5 w-5 mr-2" />
                                    Adjuntar archivos
                                </button>
                                </>
                            )}
                        </div>
                        
                        {attachedFiles.length > 0 && (
                            <div className="border border-border bg-surface rounded-lg p-4">
                                <h4 className="text-base font-semibold text-text-primary mb-3">Archivos Adjuntos</h4>
                                <ul className="space-y-2">
                                    {attachedFiles.map((file, index) => (
                                        <li key={index} className="flex justify-between items-center bg-background hover:bg-background-alt p-2 rounded-md transition-colors">
                                            <div className="flex items-center min-w-0">
                                                <PaperClipIcon className="h-5 w-5 text-text-secondary flex-shrink-0 mr-3" />
                                                <span className="text-sm text-text-primary truncate" title={file.name}>
                                                    {file.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleDownloadFile(file)} 
                                                    className="p-1.5 text-text-secondary hover:text-primary rounded-full hover:bg-primary-lightest transition-colors" 
                                                    title="Descargar"
                                                >
                                                    <DownloadIcon className="h-5 w-5" />
                                                </button>
                                                {!isReadOnly && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveFile(file)} 
                                                        className="p-1.5 text-text-secondary hover:text-status-error-text rounded-full hover:bg-status-error-bg transition-colors" 
                                                        title="Eliminar"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6">
                      <div className="md:col-span-3">
                          <SignaturePad label="Firma Preventor" isReadOnly={isReadOnly} />
                      </div>
                      
                      <div className="md:col-span-3">
                          <SignaturePad label="Firma Responsable de la empresa" isReadOnly={isReadOnly} />
                      </div>
                    </div>

                    <div className="md:col-span-6 text-right mt-6 pt-4 border-t">
                        {isReadOnly ? (
                            <button type="button" onClick={onBack} className="px-6 py-2 bg-primary text-text-on-primary rounded-md hover:bg-primary-hover transition-colors">Cerrar</button>
                        ) : (
                            <>
                                <button type="button" onClick={onBack} className="px-6 py-2 text-text-primary rounded-md hover:bg-background-alt transition-colors mr-2">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-text-on-primary rounded-md hover:bg-primary-hover transition-colors">Guardar Acta</button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VisitDetailScreen;