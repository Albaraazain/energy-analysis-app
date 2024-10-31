
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

