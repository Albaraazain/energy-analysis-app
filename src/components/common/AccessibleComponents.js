
import React, { forwardRef } from 'react';
import { theme } from '../../styles/theme';

// Accessible button with keyboard interaction
export const Button = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  onClick,
  className,
  ...props 
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-lg font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `bg-primary-500 text-white hover:bg-primary-600
              focus:ring-primary-500`,
    secondary: `bg-neutral-100 text-neutral-700 hover:bg-neutral-200
                focus:ring-neutral-500`,
    danger: `bg-error-500 text-white hover:bg-error-600
             focus:ring-error-500`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <LoadingSpinner size="sm" />
        </span>
      )}
      {children}
    </button>
  );
});

// Accessible form input
export const Input = forwardRef(({ 
  label,
  error,
  helperText,
  required,
  ...props 
}, ref) => {
  const id = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`
          w-full rounded-lg border px-4 py-2
          focus:outline-none focus:ring-2 focus:border-primary-500
          disabled:bg-neutral-50 disabled:text-neutral-500
          ${error ? 'border-error-500' : 'border-neutral-300'}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${id}-helper ${id}-error`}
        {...props}
      />
      {helperText && (
        <p
          id={`${id}-helper`}
          className="text-sm text-neutral-500"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-error-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

// Accessible toggle switch
export const Toggle = forwardRef(({ 
  checked, 
  onChange,
  label,
  disabled,
  ...props 
}, ref) => {
  const id = `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center">
      <button
        ref={ref}
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors focus:outline-none focus:ring-2
          focus:ring-primary-500 focus:ring-offset-2
          ${checked ? 'bg-primary-500' : 'bg-neutral-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        disabled={disabled}
        {...props}
      >
        <span
          className={`
            inline-block h-4 w-4 rounded-full bg-white
            transform transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className="ml-3 text-sm text-neutral-700"
        >
          {label}
        </label>
      )}
    </div>
  );
});

// Tooltip component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`
          absolute ${positions[position]} px-2 py-1
          bg-neutral-800 text-white text-sm rounded
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200
          whitespace-nowrap
        `}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
}

// Loading spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        border-2 border-neutral-200
        border-t-primary-500
        ${sizes[size]}
        ${className}
      `}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Alert component
export const Alert = ({ 
  type = 'info',
  title,
  children,
  onClose,
}) => {
  const types = {
    info: 'bg-primary-50 text-primary-700 border-primary-500',
    success: 'bg-success-50 text-success-700 border-success-500',
    warning: 'bg-warning-50 text-warning-700 border-warning-500',
    error: 'bg-error-50 text-error-700 border-error-500',
  };

  return (
    <div
      role="alert"
      className={`
        rounded-lg border-l-4 p-4
        ${types[type]}
      `}
    >
      {title && (
        <h3 className="font-medium mb-1">{title}</h3>
      )}
      <div className="text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-500"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};