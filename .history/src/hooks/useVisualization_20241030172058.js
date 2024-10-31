
import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

const useVisualization = (data, timeRange) => {
  const [processedData, setProcessedData] = useState(null);
  const [activeView, setActiveView] = useState('consumption');
  const [filters, setFilters] = useState({
    timeRange: '24h',
    groupBy: 'hour',
    showBaseline: true,
    showAnomalies: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Process data based on current filters
  const processData = useCallback(() => {
    if (!data || data.length === 0) return null;

    setIsLoading(true);
    try {
      // Group data based on selected interval
      const groupedData = groupDataByInterval(data, filters.groupBy);
      
      // Apply time range filter
      const filteredData = filterByTimeRange(groupedData, filters.timeRange);
      
      // Calculate additional metrics
      const enrichedData = enrichData(filteredData);

      setProcessedData(enrichedData);
    } catch (error) {
      console.error('Error processing visualization data:', error);
      setProcessedData(null);
    } finally {
      setIsLoading(false);
    }
  }, [data, filters]);

  // Update data when filters or source data change
  useEffect(() => {
    processData();
  }, [processData, data, filters]);

  // Group data by specified interval
  const groupDataByInterval = (data, interval) => {
    return _.chain(data)
      .groupBy(reading => {
        const date = new Date(reading.timestamp);
        switch (interval) {
          case 'hour':
            return date.setMinutes(0, 0, 0);
          case 'day':
            return date.setHours(0, 0, 0, 0);
          case 'week':
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            return startOfWeek.setHours(0, 0, 0, 0);
          default:
            return date.getTime();
        }
      })
      .map((readings, timestamp) => ({
        timestamp: Number(timestamp),
        consumption: _.meanBy(readings, 'consumption'),
        count: readings.length,
        min: _.minBy(readings, 'consumption').consumption,
        max: _.maxBy(readings, 'consumption').consumption
      }))
      .value();
  };

  // Filter data by time range
  const filterByTimeRange = (data, range) => {
    const now = new Date();
    const startTime = new Date(now);

    switch (range) {
      case '24h':
        startTime.setHours(now.getHours() - 24);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(now.getDate() - 30);
        break;
      default:
        return data;
    }

    return data.filter(item => item.timestamp >= startTime.getTime());
  };

  // Enrich data with additional metrics
  const enrichData = (data) => {
    const baseline = calculateBaseline(data);
    const anomalies = detectAnomalies(data, baseline);

    return data.map(item => ({
      ...item,
      baseline: filters.showBaseline ? baseline[new Date(item.timestamp).getHours()] : undefined,
      isAnomaly: filters.showAnomalies ? anomalies.includes(item.timestamp) : false
    }));
  };

  // Calculate baseline consumption
  const calculateBaseline = (data) => {
    return _.chain(data)
      .groupBy(item => new Date(item.timestamp).getHours())
      .mapValues(group => _.meanBy(group, 'consumption'))
      .value();
  };

  // Detect anomalies using standard deviation
  const detectAnomalies = (data, baseline) => {
    const stdDev = calculateStandardDeviation(data.map(item => item.consumption));
    const threshold = stdDev * 2; // 2 standard deviations

    return data
      .filter(item => {
        const hour = new Date(item.timestamp).getHours();
        return Math.abs(item.consumption - baseline[hour]) > threshold;
      })
      .map(item => item.timestamp);
  };

  // Calculate standard deviation
  const calculateStandardDeviation = (values) => {
    const mean = _.mean(values);
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(_.mean(squaredDiffs));
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Change active view
  const changeView = (view) => {
    setActiveView(view);
  };

  return {
    processedData,
    activeView,
    filters,
    isLoading,
    updateFilters,
    changeView,
    refreshData: processData
  };
};

export default useVisualization;