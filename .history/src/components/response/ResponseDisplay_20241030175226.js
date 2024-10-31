
import React from 'react';
import { Card } from '../components/ui/card';
import InsightCard from './InsightCard';
import MetricDisplay from './MetricDisplay';
import ComparisonView from './ComparisonView';

const ResponseDisplay = ({ analysisResult, queryType }) => {
  if (!analysisResult) return null;

  const { summary, insights, metrics, comparisons } = analysisResult;

  return (
    <div className="space-y-4">
      {/* Main Summary Card */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Energy Analysis
        </h3>
        <p className="text-gray-600">
          {summary}
        </p>
      </Card>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <MetricDisplay
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              change={metric.change}
              timeframe={metric.timeframe}
            />
          ))}
        </div>
      )}

      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              type={insight.type}
              title={insight.title}
              description={insight.description}
              value={insight.value}
              impact={insight.impact}
            />
          ))}
        </div>
      )}

      {/* Comparisons */}
      {comparisons && (
        <ComparisonView 
          data={comparisons}
          type={queryType}
        />
      )}
    </div>
  );
};

export default ResponseDisplay;