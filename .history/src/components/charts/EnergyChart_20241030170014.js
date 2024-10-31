
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { formatDate, formatTime } from '../../utils/dateUtils';

const EnergyChart = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => formatTime(new Date(timestamp))}
            interval="preserveStartEnd"
          />
          <YAxis
            label={{ 
              value: 'Energy (kWh)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' } 
            }}
          />
          <Tooltip
            labelFormatter={(timestamp) => formatDate(new Date(timestamp))}
            formatter={(value) => [`${value.toFixed(2)} kWh`, 'Consumption']}
          />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;