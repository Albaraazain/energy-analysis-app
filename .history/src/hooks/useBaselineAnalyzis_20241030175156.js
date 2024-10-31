// useBaselineAnalysis Hook:

// Manages baseline calculations
// Tracks analysis state
// Provides comparison functionality
// Generates insights
// Handles errors


import { useState, useEffect, useCallback } from 'react';
import BaselineAnalyzer from '../utils/baselineAnalyzer';

const useBaselineAnalysis = (data, timeRange) => {
  const [analyzer, setAnalyzer] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize analyzer when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setAnalyzer(new BaselineAnalyzer(data));
    }
  }, [data]);

  // Perform analysis when timeRange changes
  useEffect(() => {
    if (!analyzer || !timeRange) return;

    const analyzeData = async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        // Calculate baseline
        const newBaseline = analyzer.calculateBaseline(timeRange);
        setBaseline(newBaseline);

        // Detect patterns
        const newPatterns = analyzer.detectPatterns(timeRange);
        setPatterns(newPatterns);
      } catch (err) {
        setError('Failed to analyze consumption patterns');
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeData();
  }, [analyzer, timeRange]);

  // Compare current usage to baseline
  const compareToBaseline = useCallback((readings) => {
    if (!analyzer || !baseline || !readings) return null;
    return analyzer.compareToBaseline(readings, baseline);
  }, [analyzer, baseline]);

  // Generate insights from patterns
  const generateInsights = useCallback(() => {
    if (!patterns || !baseline) return [];

    const insights = [];

    // Peak usage insights
    if (patterns.peakUsagePeriods.length > 0) {
      const topPeak = patterns.peakUsagePeriods[0];
      insights.push({
        type: 'peak',
        title: 'Peak Usage Time',
        description: `Highest usage typically occurs at ${topPeak.hour}:00`,
        significance: topPeak.significance
      });
    }

    // Daily pattern insights
    const { weekday, weekend } = patterns.dailyPatterns;
    const weekdayWeekendDiff = ((weekend.average - weekday.average) / weekday.average) * 100;

    if (Math.abs(weekdayWeekendDiff) > 20) {
      insights.push({
        type: 'daily',
        title: 'Weekend vs Weekday Usage',
        description: `Weekend usage is ${Math.abs(weekdayWeekendDiff).toFixed(1)}% ${weekdayWeekendDiff > 0 ? 'higher' : 'lower'} than weekdays`,
        significance: Math.abs(weekdayWeekendDiff) / 100
      });
    }

    // Time-of-day insights
    const { morning, evening } = patterns.hourlyPatterns;
    const morningEveningDiff = ((evening.averageUsage - morning.averageUsage) / morning.averageUsage) * 100;

    if (Math.abs(morningEveningDiff) > 30) {
      insights.push({
        type: 'hourly',
        title: 'Usage Distribution',
        description: `Energy usage is significantly ${morningEveningDiff > 0 ? 'higher' : 'lower'} in the evening compared to morning`,
        significance: Math.abs(morningEveningDiff) / 100
      });
    }

    return insights.sort((a, b) => b.significance - a.significance);
  }, [patterns, baseline]);

  return {
    baseline,
    patterns,
    isAnalyzing,
    error,
    compareToBaseline,
    generateInsights
  };
};

export default useBaselineAnalysis;