import React from 'react';

interface SignaturePadProps {
  label: string;
  isReadOnly?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, isReadOnly = false }) => (
    <div>
        <div className={`w-full h-32 rounded-md border border-gray-300 flex items-center justify-center transition-colors ${isReadOnly ? 'bg-gray-100' : 'bg-cyan-50/50 cursor-pointer hover:border-secondary'}`}>
            {isReadOnly ? (
                <span className="text-gray-500 font-medium">Firmado</span>
            ) : (
                <span className="text-gray-400 italic">Área de firma</span>
            )}
        </div>
        <div className="mt-2 border-t border-gray-400 pt-1">
            <p className="text-sm text-gray-700 text-center">{label} {!isReadOnly && <span className="text-red-500">*</span>}</p>
        </div>
    </div>
);

export default SignaturePad;
