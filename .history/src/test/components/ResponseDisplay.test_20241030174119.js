# File: src/tests/components/ResponseDisplay.test.js

import React from 'react';
import { render, screen } from '../setup/test-utils';
import ResponseDisplay from '../../components/response/ResponseDisplay';
import { mockAnalysisResults } from '../mocks/dataMocks';

describe('ResponseDisplay', () => {
  it('renders analysis results', () => {
    render(<ResponseDisplay analysisResult={mockAnalysisResults} />);
    expect(screen.getByText(/energy analysis/i)).toBeInTheDocument();
  });

  it('shows insights when available', () => {
    render(<ResponseDisplay analysisResult={mockAnalysisResults} />);
    expect(screen.getByText(/consumption trend/i)).toBeInTheDocument();
  });

  it('handles empty state', () => {
    render(<ResponseDisplay analysisResult={null} />);
    expect(screen.getByText(/no analysis available/i)).toBeInTheDocument();
  });
});
