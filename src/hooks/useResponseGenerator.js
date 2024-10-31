// useResponseGenerator Hook:

// Response generation management
// Visualization recommendations
// Priority-based visualization ordering
// Anomaly integration
// Query-type specific responses

import { useState, useCallback } from 'react';
import responseGenerator from '../utils/responseGenerator';

const useResponseGenerator = (analysis, queryType) => {
  const [response, setResponse] = useState(null);
  const [visualizations, setVisualizations] = useState([]);

  // Generate response with recommended visualizations
  const generateResponse = useCallback(() => {
    if (!analysis) return null;

    // Generate natural language response
    const textResponse = responseGenerator.generateResponse(analysis, queryType);

    // Determine appropriate visualizations based on analysis and query type
    const recommendedVisualizations = determineVisualizations(analysis, queryType);

    setResponse(textResponse);
    setVisualizations(recommendedVisualizations);

    return {
      text: textResponse,
      visualizations: recommendedVisualizations
    };
  }, [analysis, queryType]);

  // Helper function to determine appropriate visualizations
  const determineVisualizations = (analysis, queryType) => {
    const visualizations = [];

    switch (queryType) {
      case 'usage_inquiry':
        // Show basic line chart for usage over time
        visualizations.push({
          type: 'lineChart',
          data: analysis.hourlyData,
          title: 'Energy Usage Over Time',
          priority: 1
        });
        break;

      case 'comparison':
        // Show comparison bar chart
        visualizations.push({
          type: 'barChart',
          data: analysis.comparisonData,
          title: 'Usage Comparison',
          priority: 1
        });
        
        // Add trend line if applicable
        if (analysis.trends?.trend) {
          visualizations.push({
            type: 'trendLine',
            data: analysis.trends.movingAverage,
            title: 'Usage Trend',
            priority: 2
          });
        }
        break;

      case 'pattern':
        // Show daily pattern heatmap
        visualizations.push({
          type: 'heatmap',
          data: analysis.patterns?.hourlyPattern,
          title: 'Daily Usage Pattern',
          priority: 1
        });

        // Add weekly pattern if available
        if (analysis.patterns?.weeklyPattern) {
          visualizations.push({
            type: 'barChart',
            data: analysis.patterns.weeklyPattern,
            title: 'Weekly Usage Pattern',
            priority: 2
          });
        }
        break;

      default:
        // Default to simple line chart
        visualizations.push({
          type: 'lineChart',
          data: analysis.hourlyData,
          title: 'Energy Consumption',
          priority: 1
        });
    }

    // Add anomaly markers if anomalies detected
    if (analysis.anomalies?.length > 0) {
      visualizations.forEach(viz => {
        if (viz.type === 'lineChart') {
          viz.anomalies = analysis.anomalies;
        }
      });
    }

    // Sort by priority
    return visualizations.sort((a, b) => a.priority - b.priority);
  };

  return {
    response,
    visualizations,
    generateResponse
  };
};

export default useResponseGenerator;