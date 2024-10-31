
import React from 'react';
import { Card } from '../ui/card';import {
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