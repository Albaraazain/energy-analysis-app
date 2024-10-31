# File: src/components/layout/ResponsiveLayouts.js

import React from 'react';
import { theme } from '../../styles/theme';

// Responsive grid component
export const ResponsiveGrid = ({
  children,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = ''
}) => {
  const gaps = {
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg
  };

  return (
    <div
      className={`grid ${className}`}
      style={{
        gap: gaps[gap],
        gridTemplateColumns: `repeat(${columns.sm}, 1fr)`,
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          gridTemplateColumns: `repeat(${columns.md}, 1fr)`
        },
        [`@media (min-width: ${theme.breakpoints.lg})`]: {
          gridTemplateColumns: `repeat(${columns.lg}, 1fr)`
        }
      }}
    >
      {children}
    </div>
  );
};

// Responsive container
export const Container = ({
  children,
  maxWidth = 'lg',
  padding = true,
  className = ''
}) => {
  const maxWidths = {
    sm: theme.breakpoints.sm,
    md: theme.breakpoints.md,
    lg: theme.breakpoints.lg,
    xl: theme.breakpoints.xl
  };

  return (
    <div
      className={`mx-auto ${padding ? 'px-4 sm:px-6 lg:px-8' : ''} ${className}`}
      style={{ maxWidth: maxWidths[maxWidth] }}
    >
      {children}
    </div>
  );
};

// Responsive stack (vertical layout)
export const Stack = ({
  children,
  spacing = 'md',
  className = ''
}) => {
  const spacings = {
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg
  };

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ gap: spacings[spacing] }}
    >
      {children}
    </div>
  );
};

// Responsive sidebar layout
export const SidebarLayout = ({
  sidebar,
  children,
  sidebarWidth = '300px',
  className = ''
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < parseInt(theme.breakpoints.lg));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform' : 'relative'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          bg-white
        `}
        style={{ width: sidebarWidth }}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

// Responsive navigation
export const ResponsiveNav = ({
  brand,
  links,
  actions,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className={`bg-white shadow ${className}`}>
      <Container>
        <div className="flex justify-between h-16">
          {/* Brand and toggle button */}
          <div className="flex">
            <div className="flex items-center">
              {brand}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? '×' : '☰'}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {links}
            {actions}
          </div>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden py-2">
            {links}
            <div className="mt-4 pt-4 border-t">
              {actions}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
};