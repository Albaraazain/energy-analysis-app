# File: src/components/visualization/VisualizationRenderer.js

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';

const VisualizationRenderer = ({ visualization }) => {
  const { type, data, title, config = {} } = visualization;

  if (!data || data.length === 0) {
    return null;
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.xAxis || 'timestamp'} 
                tickFormatter={config.xAxisFormatter}
              />
              <YAxis
                label={{ 
                  value: config.yAxisLabel || 'Energy (kWh)',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={config.dataKey || 'value'} 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.xAxis || 'timestamp'}
                tickFormatter={config.xAxisFormatter}
              />
              <YAxis
                label={{ 
                  value: config.yAxisLabel || 'Energy (kWh)',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Bar 
                dataKey={config.dataKey || 'value'} 
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            {data.map((stat, index) => (
              <div 
                key={index}
                className="p-4 bg-blue-50 rounded-lg"
              >
                <div className="text-sm text-blue-600 font-medium">
                  {stat.label}
                </div>
                <div className="text-xl font-semibold">
                  {stat.value} {stat.unit}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            Unsupported visualization type: {type}
          </div>
        );
    }
  };

  return (
    <Card className="mt-4">
      {title && (
        <div className="px-4 py-2 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {renderChart()}
      </div>
    </Card>
  );
};

export default VisualizationRenderer;