
import React from 'react';
import { render } from '@testing-library/react';
import { EnergyAnalysisProvider } from '../../context/EnergyAnalysisContext';

// Custom render function that includes providers
const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <EnergyAnalysisProvider>
      {children}
    </EnergyAnalysisProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock energy data for testing
export const mockEnergyData = [
  {
    timestamp: '2024-01-01T00:00:00',
    consumption: 2.5
  },
  {
    timestamp: '2024-01-01T01:00:00',
    consumption: 2.3
  },
  // Add more mock data as needed
];

// Mock handlers for common actions
export const mockHandlers = {
  onQuerySubmit: jest.fn(),
  onTimeRangeChange: jest.fn(),
  onViewChange: jest.fn()
};

// Helper to simulate loading states
export const createLoadingState = (duration = 1000) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

// Export everything from RTL with our custom render
export * from '@testing-library/react';
export { customRender as render };

