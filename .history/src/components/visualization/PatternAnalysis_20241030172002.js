# File: src/components/visualization/PatternAnalysis.js

import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell
} from 'recharts';

const PatternAnalysis = ({ data, height = 400 }) => {
  const [selectedPattern, setSelectedPattern] = useState(null);

  // Process data for pattern visualization
  const processData = (rawData) => {
    // Group by hour and day of week
    const patterns = rawData.reduce((acc, reading) => {
      const date = new Date(reading.timestamp);
      const hour = date.getHours();
      const day = date.getDay();
      
      if (!acc[`${day}-${hour}`]) {
        acc[`${day}-${hour}`] = {
          day,
          hour,
          readings: []
        };
      }
      
      acc[`${day}-${hour}`].readings.push(reading.consumption);
      return acc;
    }, {});

    // Calculate averages and variations
    return Object.values(patterns).map(pattern => ({
      day: pattern.day,
      hour: pattern.hour,
      value: pattern.readings.reduce((a, b) => a + b, 0) / pattern.readings.length,
      variance: calculateVariance(pattern.readings)
    }));
  };

  const calculateVariance = (readings) => {
    const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
    return readings.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / readings.length;
  };

  const getPatternColor = (value, variance) => {
    // Color based on consumption value and variance
    const hue = Math.max(0, Math.min(240, (1 - value / 10) * 240)); // Blue to Red
    const saturation = Math.min(100, variance * 50 + 50); // More saturated = more variable
    return `hsl(${hue}, ${saturation}%, 50%)`;
  };

  const formatDayLabel = (day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };

  const formatHourLabel = (hour) => {
    return `${hour}:00`;
  };

  const patternData = processData(data);

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Usage Patterns</h3>
        <p className="text-sm text-gray-500">
          Darker colors indicate higher consumption, size indicates variability
        </p>
      </div>

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <XAxis
              dataKey="hour"
              name="Hour"
              tickFormatter={formatHourLabel}
              type="number"
              domain={[0, 23]}
            />
            <YAxis
              dataKey="day"
              name="Day"
              tickFormatter={formatDayLabel}
              type="number"
              domain={[0, 6]}
            />
            <ZAxis
              dataKey="variance"
              range={[50, 400]}
              name="Variance"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ payload }) => {
                if (!payload || !payload[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 shadow rounded border">
                    <p className="font-medium">
                      {formatDayLabel(data.day)} at {formatHourLabel(data.hour)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Average: {data.value.toFixed(2)} kWh
                    </p>
                    <p className="text-sm text-gray-600">
                      Variance: {data.variance.toFixed(2)}
                    </p>
                  </div>
                );
              }}
            />
            <Scatter data={patternData} shape="circle">
              {patternData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getPatternColor(entry.value, entry.variance)}
                  onClick={() => setSelectedPattern(entry)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Pattern Details */}
      {selectedPattern && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">
            Pattern Details: {formatDayLabel(selectedPattern.day)} at {formatHourLabel(selectedPattern.hour)}
          </h4>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Average Consumption: {selectedPattern.value.toFixed(2)} kWh</p>
            <p>Variability: {
              selectedPattern.variance < 0.1 ? 'Very Consistent' :
              selectedPattern.variance < 0.3 ? 'Somewhat Variable' :
              'Highly Variable'
            }</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PatternAnalysis;