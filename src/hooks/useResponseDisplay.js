// ResponseDisplay Component:

// Main display container
// Section organization
// Responsive layout
// Component composition

import { useState, useEffect, useCallback } from 'react';

const useResponseDisplay = (analysisResult, queryType) => {
  const [displayData, setDisplayData] = useState(null);
  const [activeSection, setActiveSection] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);

  // Format analysis result for display
  const formatDisplayData = useCallback((result) => {
    if (!result) return null;

    return {
      summary: formatSummary(result),
      metrics: formatMetrics(result),
      insights: formatInsights(result),
      comparisons: formatComparisons(result)
    };
  }, []);

  // Format summary section
  const formatSummary = (result) => {
    const { totalConsumption, averageConsumption, trend } = result.summary;
    
    return {
      text: `Your total energy consumption was ${totalConsumption.toFixed(2)} kWh, 
             with an average of ${averageConsumption.toFixed(2)} kWh. 
             Overall trend shows ${trend.direction} consumption.`,
      highlight: trend.direction !== 'stable'
    };
  };

  // Format metrics section
  const formatMetrics = (result) => {
    const { current, previous } = result;
    
    return [
      {
        title: 'Total Consumption',
        value: current.total,
        unit: 'kWh',
        change: ((current.total - previous.total) / previous.total) * 100,
        timeframe: 'previous period'
      },
      {
        title: 'Average Daily',
        value: current.average,
        unit: 'kWh/day',
        change: ((current.average - previous.average) / previous.average) * 100,
        timeframe: 'previous period'
      },
      {
        title: 'Peak Usage',
        value: current.peak,
        unit: 'kWh',
        timeframe: 'highest recorded'
      }
    ];
  };

  // Format insights section
  const formatInsights = (result) => {
    const insights = [];
    
    // Add trend insight
    if (result.trends?.trend) {
      insights.push({
        type: result.trends.trend.direction === 'increasing' ? 'negative' : 'positive',
        title: 'Consumption Trend',
        description: `Your energy usage is ${result.trends.trend.direction}`,
        value: result.trends.trend.magnitude,
        impact: result.trends.trend.direction === 'increasing' ? 1 : -1
      });
    }

    // Add pattern insights
    if (result.patterns?.significant) {
      insights.push({
        type: 'neutral',
        title: 'Usage Pattern',
        description: result.patterns.description,
        value: null
      });
    }

    // Add comparison insight
    if (result.comparison) {
      const percentChange = ((result.current.total - result.previous.total) / result.previous.total) * 100;
      insights.push({
        type: percentChange > 0 ? 'negative' : 'positive',
        title: 'Period Comparison',
        description: `Consumption ${percentChange > 0 ? 'increased' : 'decreased'} compared to previous period`,
        value: Math.abs(percentChange),
        impact: percentChange > 0 ? 1 : -1
      });
    }

    return insights;
  };

  // Format comparisons section
  const formatComparisons = (result) => {
    if (!result.comparison) return null;

    return result.comparison.hourlyData.map(hour => ({
      timestamp: hour.timestamp,
      value: hour.consumption,
      baseline: hour.baseline
    }));
  };

  // Update display when analysis result changes
  useEffect(() => {
    if (!analysisResult) return;

    setIsLoading(true);
    const formatted = formatDisplayData(analysisResult);
    setDisplayData(formatted);
    setIsLoading(false);
  }, [analysisResult, formatDisplayData]);

  // Handle section navigation
  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  return {
    displayData,
    activeSection,
    isLoading,
    navigateToSection
  };
};

export default useResponseDisplay;