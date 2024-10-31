import { useState, useEffect } from 'react';
import dataLoader from '../utils/data-loader';

const useEnergyData = (fileName) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReadings: 0,
    dateRange: { start: null, end: null },
    hasGaps: false,
    hasAnomalies: false
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const energyData = await dataLoader.loadCsvData(fileName);
        
        if (!mounted) return;

        setData(energyData);
        
        // Calculate basic stats
        setStats({
          totalReadings: energyData.length,
          dateRange: {
            start: energyData[0]?.timestamp,
            end: energyData[energyData.length - 1]?.timestamp
          },
          hasGaps: energyData.some(d => d.gap),
          hasAnomalies: energyData.some(d => d.anomaly)
        });

      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        setData([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fileName]);

  // Refresh data manually
  const refreshData = async () => {
    dataLoader.clearCache();
    setIsLoading(true);
    try {
      const freshData = await dataLoader.loadCsvData(fileName);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    stats,
    refreshData
  };
};

export default useEnergyData;