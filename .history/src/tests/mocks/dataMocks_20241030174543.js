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