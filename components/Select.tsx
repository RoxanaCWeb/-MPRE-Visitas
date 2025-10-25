import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  error?: boolean;
}

const Select: React.FC<SelectProps> = ({ id, options, placeholder, error, ...props }) => {
  const baseClasses = `w-full bg-surface text-text-primary appearance-none pl-4 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 transition placeholder:text-text-placeholder disabled:bg-background-alt disabled:cursor-not-allowed disabled:text-text-secondary`;
  
  const stateClasses = error 
    ? 'border-status-error-text focus:ring-status-error-text' 
    : 'border-border-strong focus:ring-primary-focus-ring';

  return (
    <div className="relative">
      <select
        id={id}
        {...props}
        className={`${baseClasses} ${stateClasses}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <ChevronDownIcon className="h-5 w-5 text-text-tertiary" />
      </div>
    </div>
  );
};

export default Select;