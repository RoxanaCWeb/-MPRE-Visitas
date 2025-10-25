import React from 'react';

interface SignaturePadProps {
  label: string;
  isReadOnly?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, isReadOnly = false }) => (
    <div>
        <div className={`w-full h-32 rounded-md border border-border-strong flex items-center justify-center transition-colors ${isReadOnly ? 'bg-background-alt' : 'bg-primary-lightest cursor-pointer hover:border-primary'}`}>
            {isReadOnly ? (
                <span className="text-text-secondary font-medium">Firmado</span>
            ) : (
                <span className="text-text-tertiary italic">Área de firma</span>
            )}
        </div>
        <div className="mt-2 border-t border-border-strong pt-1">
            <p className="text-sm text-text-primary text-center">{label} {!isReadOnly && <span className="text-status-error-text">*</span>}</p>
        </div>
    </div>
);

export default SignaturePad;