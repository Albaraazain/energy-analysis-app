# File: src/tests/performance/performance.test.js

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

# File: src/tests/performance/performanceUtils.js

// Measure render time
export const measureRenderTime = async (renderFn) => {
  const start = performance.now();
  await renderFn();
  return performance.now() - start;
};

// Measure memory usage
export const measureMemoryUsage = async () => {
  if (performance.memory) {
    return performance.memory.usedJSHeapSize;
  }
  return 0;
};

// Test data processing performance
export const testDataProcessing = (processFn, data, iterations = 100) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    processFn(data);
    times.push(performance.now() - start);
  }

  return {
    average: times.reduce((a, b) => a + b) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    p95: times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)]
  };
};

# File: src/tests/performance/loadTesting.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

export default function () {
  const response = http.get('http://localhost:3000/api/energy-data');
  
  check(response, {
    'is status 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}