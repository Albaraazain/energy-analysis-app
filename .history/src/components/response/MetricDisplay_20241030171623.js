# File: src/components/response/MetricDisplay.js

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

# File: src/components/response/ComparisonView.js

import React from 'react';
import { Card } from '../components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const ComparisonView = ({ data, type }) => {
  const formatData = (data) => {
    switch (type) {
      case 'daily':
        return data.map(item => ({
          ...item,
          name: new Date(item.timestamp).toLocaleDateString('en-US', {
            weekday: 'short'
          })
        }));
      case 'hourly':
        return data.map(item => ({
          ...item,
          name: new Date(item.timestamp).getHours() + ':00'
        }));
      default:
        return data;
    }
  };

  const formattedData = formatData(data);

  return (
    <Card className="p-4">
      <h4 className="font-medium text-gray-900 mb-4">
        Consumption Comparison
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ComparisonView;