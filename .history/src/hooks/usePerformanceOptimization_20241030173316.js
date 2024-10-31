
import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce, processInChunks, getVisibleItems } from '../utils/performance';

// Hook for virtual scrolling
export const useVirtualScroll = (items, itemHeight = 50) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const updateVisibleItems = useCallback(() => {
    if (!containerRef.current) return;

    const { height } = containerRef.current.getBoundingClientRect();
    const { items: visible, startIndex } = getVisibleItems(
      items,
      scrollTop,
      height,
      itemHeight
    );

    setVisibleItems(visible.map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index
    })));
  }, [items, scrollTop, itemHeight]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems, items, scrollTop]);

  return {
    containerRef,
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
};

// Hook for optimized data loading
export const useOptimizedDataLoading = (loadData, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const loadDataOptimized = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await loadData((progressValue) => {
        setProgress(progressValue);
      });

      // Process data in chunks if it's large
      if (Array.isArray(result) && result.length > 1000) {
        const processedData = await processInChunks(
          result,
          async (item) => ({ ...item, processed: true }),
          1000
        );
        setData(processedData);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadDataOptimized();
  }, dependencies);

  return { data, isLoading, progress, error, reload: loadDataOptimized };
};

// Hook for efficient data updates
export const useEfficientUpdates = (initialData) => {
  const [data, setData] = useState(initialData);
  const updateQueue = useRef([]);
  const isProcessing = useRef(false);

  const processUpdateQueue = async () => {
    if (isProcessing.current || updateQueue.current.length === 0) return;

    isProcessing.current = true;
    const updates = [...updateQueue.current];
    updateQueue.current = [];

    const newData = [...data];
    await processInChunks(updates, update => {
      const { index, value } = update;
      newData[index] = value;
    });

    setData(newData);
    isProcessing.current = false;

    if (updateQueue.current.length > 0) {
      processUpdateQueue();
    }
  };

  const queueUpdate = useCallback((index, value) => {
    updateQueue.current.push({ index, value });
    processUpdateQueue();
  }, []);

  return [data, queueUpdate];
};

// Hook for optimized chart data
export const useOptimizedChartData = (rawData, options = {}) => {
  const {
    maxPoints = 100,
    aggregationType = 'average'
  } = options;

  const optimizeData = useCallback((data) => {
    if (!data || data.length <= maxPoints) return data;

    const chunkSize = Math.ceil(data.length / maxPoints);
    const optimizedData = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, Math.min(i + chunkSize, data.length));
      const aggregatedValue = aggregationType === 'average'
        ? chunk.reduce((sum, item) => sum + item.value, 0) / chunk.length
        : Math.max(...chunk.map(item => item.value));

      optimizedData.push({
        timestamp: chunk[0].timestamp,
        value: aggregatedValue,
        isAggregated: true,
        dataPoints: chunk.length
      });
    }

    return optimizedData;
  }, [maxPoints, aggregationType]);

  const [optimizedChartData, setOptimizedChartData] = useState(() => 
    optimizeData(rawData)
  );

  useEffect(() => {
    setOptimizedChartData(optimizeData(rawData));
  }, [rawData, optimizeData]);

  return optimizedChartData;
};