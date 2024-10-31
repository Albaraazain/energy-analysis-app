# File: src/tests/components/EnergyChart.test.js

import React from 'react';
import { render, screen, fireEvent } from '../setup/test-utils';
import EnergyChart from '../../components/visualization/EnergyChart';
import { mockEnergyData } from '../setup/test-utils';

describe('EnergyChart', () => {
  it('renders with data', () => {
    render(<EnergyChart data={mockEnergyData} />);
    expect(screen.getByRole('img', { name: /energy usage chart/i })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<EnergyChart data={[]} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles time range changes', () => {
    const onTimeRangeChange = jest.fn();
    render(<EnergyChart data={mockEnergyData} onTimeRangeChange={onTimeRangeChange} />);
    
    fireEvent.click(screen.getByText('24h'));
    expect(onTimeRangeChange).toHaveBeenCalledWith('24h');
  });
});

# File: src/tests/components/ChatInterface.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import ChatInterface from '../../components/chat/ChatInterface';
import { mockHandlers } from '../setup/test-utils';

describe('ChatInterface', () => {
  it('renders input field', () => {
    render(<ChatInterface />);
    expect(screen.getByPlaceholderText(/ask about your energy/i)).toBeInTheDocument();
  });

  it('handles message submission', async () => {
    const { onQuerySubmit } = mockHandlers;
    render(<ChatInterface onQuerySubmit={onQuerySubmit} />);
    
    const input = screen.getByPlaceholderText(/ask about your energy/i);
    fireEvent.change(input, { target: { value: 'How much energy did I use yesterday?' } });
    fireEvent.click(screen.getByText(/send/i));

    await waitFor(() => {
      expect(onQuerySubmit).toHaveBeenCalledWith('How much energy did I use yesterday?');
    });
  });

  it('shows error message on invalid input', async () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/ask about your energy/i);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText(/send/i));

    expect(screen.getByText(/please enter a query/i)).toBeInTheDocument();
  });
});

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

# File: src/tests/hooks/useEnergyAnalysis.test.js

import { renderHook, act } from '@testing-library/react-hooks';
import { useEnergyAnalysis } from '../../hooks/useEnergyAnalysis';
import { mockEnergyData, mockTimeRanges } from '../mocks/dataMocks';

describe('useEnergyAnalysis', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useEnergyAnalysis());
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeNull();
  });

  it('loads and processes data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEnergyAnalysis());
    
    act(() => {
      result.current.loadData(mockEnergyData);
    });

    await waitForNextUpdate();
    
    expect(result.current.data).toEqual(mockEnergyData);
    expect(result.current.processedData).toBeTruthy();
  });

  it('handles time range changes', () => {
    const { result } = renderHook(() => useEnergyAnalysis());
    
    act(() => {
      result.current.setTimeRange(mockTimeRanges.day);
    });

    expect(result.current.timeRange).toEqual(mockTimeRanges.day);
  });
});