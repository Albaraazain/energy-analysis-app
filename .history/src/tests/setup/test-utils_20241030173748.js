# File: src/tests/setup/test-utils.js

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

# File: src/tests/mocks/dataMocks.js

// Mock response for energy data
export const mockEnergyResponse = {
  data: mockEnergyData,
  summary: {
    totalConsumption: 4.8,
    averageConsumption: 2.4,
    peakUsage: 2.5
  }
};

// Mock error responses
export const mockErrorResponses = {
  dataLoadError: {
    message: 'Failed to load energy data',
    code: 'DATA_LOAD_ERROR'
  },
  queryError: {
    message: 'Invalid query format',
    code: 'QUERY_ERROR'
  }
};

// Mock time ranges
export const mockTimeRanges = {
  day: {
    start: new Date('2024-01-01T00:00:00'),
    end: new Date('2024-01-01T23:59:59')
  },
  week: {
    start: new Date('2024-01-01T00:00:00'),
    end: new Date('2024-01-07T23:59:59')
  }
};

// Mock analysis results
export const mockAnalysisResults = {
  trends: {
    direction: 'increasing',
    magnitude: 1.2,
    confidence: 0.8
  },
  patterns: {
    daily: {
      morning: { average: 2.1 },
      evening: { average: 2.8 }
    }
  }
};