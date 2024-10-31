
import { render, screen } from '@testing-library/react';
import { measureRenderTime, measureMemoryUsage } from './performanceUtils';
import App from '../../App';
import { mockEnergyData } from '../setup/test-utils';

describe('Performance Tests', () => {
  // Test initial render time
  it('renders main app within performance budget', async () => {
    const renderTime = await measureRenderTime(() => {
      render(<App />);
    });

    expect(renderTime).toBeLessThan(200); // 200ms budget
  });

  // Test chart rendering performance
  it('renders chart with large dataset efficiently', async () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      timestamp: new Date(2024, 0, 1, i % 24).toISOString(),
      consumption: Math.random() * 5
    }));

    const renderTime = await measureRenderTime(() => {
      render(<EnergyChart data={largeDataset} />);
    });

    expect(renderTime).toBeLessThan(500); // 500ms budget for large dataset
  });

  // Test memory usage
  it('maintains reasonable memory usage', async () => {
    const memoryBefore = await measureMemoryUsage();
    
    render(<App />);
    
    const memoryAfter = await measureMemoryUsage();
    const memoryIncrease = memoryAfter - memoryBefore;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB budget
  });
});

