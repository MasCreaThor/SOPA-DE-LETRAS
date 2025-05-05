// src/components/common/Input.tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = false,
  leftIcon,
  rightIcon,
  helpText,
  className = '',
  id,
  ...rest
}, ref) => {
  // Generate random ID for input if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base classes
  const inputBaseClasses = 'block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
  
  // Error classes
  const inputErrorClasses = 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500';
  
  // Width classes
  const containerWidthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${containerWidthClasses}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${inputBaseClasses}
            ${error ? inputErrorClasses : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${inputId}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';