

import { useState, useEffect, useCallback } from 'react';
import ConsumptionAnalyzer from '../utils/consumptionAnalyzer';

const useConsumptionAnalysis = (data, timeRange) => {
  const [analyzer, setAnalyzer] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize analyzer when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setAnalyzer(new ConsumptionAnalyzer(data));
    }
  }, [data]);

  // Perform analysis when timeRange changes
  useEffect(() => {
    if (!analyzer || !timeRange) return;

    const performAnalysis = async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const results = analyzer.analyzeTimeRange(
          timeRange.start,
          timeRange.end
        );

        if (results.error) {
          throw new Error(results.error);
        }

        setAnalysis(results);
      } catch (err) {
        setError(err.message);
        setAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [analyzer, timeRange]);

  // Generate insights based on analysis
  const generateInsights = useCallback(() => {
    if (!analysis) return [];

    const insights = [];

    // Trend insights
    if (analysis.trends.trend.confidence > 0.6) {
      insights.push({
        type: 'trend',
        title: 'Consumption Trend',
        description: `Energy consumption is ${analysis.trends.trend.direction} 
          ${analysis.trends.trend.magnitude > 0.1 ? 'significantly' : 'slightly'}`,
        confidence: analysis.trends.trend.confidence
      });
    }

    // Variability insights
    const { coefficientOfVariation } = analysis.trends.variability;
    if (coefficientOfVariation > 0.2) {
      insights.push({
        type: 'variability',
        title: 'Usage Variability',
        description: `Your energy usage shows ${
          coefficientOfVariation > 0.4 ? 'high' : 'moderate'
        } variability`,
        confidence: Math.min(coefficientOfVariation * 2, 1)
      });
    }

    // Peak usage insights
    const { max, median } = analysis.statistics;
    if (max > median * 2) {
      insights.push({
        type: 'peak',
        title: 'Peak Usage',
        description: 'Significant peak usage detected, considerably higher than typical consumption',
        confidence: Math.min((max / median - 1) / 2, 1)
      });
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }, [analysis]);

  // Format analysis for display
  const formatAnalysis = useCallback(() => {
    if (!analysis) return null;

    return {
      summary: {
        total: analysis.totalConsumption.toFixed(2),
        average: analysis.averageConsumption.toFixed(2),
        peak: analysis.statistics.max.toFixed(2),
        lowest: analysis.statistics.min.toFixed(2)
      },
      trends: {
        direction: analysis.trends.trend.direction,
        confidence: (analysis.trends.trend.confidence * 100).toFixed(1) + '%',
        variability: (analysis.trends.variability.coefficientOfVariation * 100).toFixed(1) + '%'
      },
      reliability: (analysis.summary.reliability * 100).toFixed(1) + '%'
    };
  }, [analysis]);

  return {
    analysis,
    isAnalyzing,
    error,
    generateInsights,
    formatAnalysis
  };
};

export default useConsumptionAnalysis;