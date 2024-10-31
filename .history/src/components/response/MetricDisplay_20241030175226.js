// MetricDisplay for numerical data

import React from 'react';
import { Card } from '../components/ui/card';

const MetricDisplay = ({ title, value, unit, change, timeframe }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toFixed(2);
    }
    return val;
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="p-4">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-1 flex items-baseline">
        <div className="text-2xl font-semibold">
          {formatValue(value)}
        </div>
        {unit && (
          <div className="ml-2 text-sm text-gray-500">{unit}</div>
        )}
      </div>
      {(change || timeframe) && (
        <div className="mt-2 flex items-center text-sm">
          {change && (
            <span className={`font-medium ${getChangeColor()}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
          {timeframe && (
            <span className="text-gray-500 ml-2">
              vs {timeframe}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default MetricDisplay;
