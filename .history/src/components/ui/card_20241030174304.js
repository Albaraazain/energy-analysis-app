# File: src/components/ui/card.js

import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-4 py-5 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-4 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-medium leading-6 text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`mt-1 text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
};