
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card } from './components/ui/card';

const EnergyChart = ({ 
  data,
  type = 'line',
  height = 400,
  showControls = true,
  onTimeRangeChange
}) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('24h');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  // Format tooltip value
  const formatValue = (value) => {
    return `${value.toFixed(2)} kWh`;
  };

  // Format x-axis labels based on time range
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <Card className="p-4">
      {showControls && (
        <div className="mb-4 flex justify-between items-center">
          {/* Chart Type Controls */}
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'line'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Bar
            </button>
          </div>

          {/* Time Range Controls */}
          <div className="flex space-x-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatValue}
                label={{ 
                  value: 'Energy (kWh)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value) => formatValue(value)}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="Consumption"
              />
              {data[0]?.baseline && (
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Baseline"
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatValue}
                label={{ 
                  value: 'Energy (kWh)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value) => formatValue(value)}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Legend />
              <Bar
                dataKey="consumption"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="Consumption"
              />
              {data[0]?.baseline && (
                <Bar
                  dataKey="baseline"
                  fill="#9ca3af"
                  radius={[4, 4, 0, 0]}
                  name="Baseline"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EnergyChart;