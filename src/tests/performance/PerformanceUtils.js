
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

