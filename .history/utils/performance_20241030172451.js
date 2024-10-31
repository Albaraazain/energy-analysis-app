
// Debounce utility for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoization utility for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Chunk data processing for better performance
export const processInChunks = async (items, processItem, chunkSize = 1000) => {
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const processedChunk = await Promise.all(chunk.map(processItem));
    results.push(...processedChunk);
    // Allow UI to update between chunks
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return results;
};

// Virtual scrolling helper
export const getVisibleItems = (items, scrollTop, viewportHeight, itemHeight) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(viewportHeight / itemHeight + 1),
    items.length
  );
  return {
    items: items.slice(startIndex, endIndex),
    startIndex,
    endIndex
  };
};