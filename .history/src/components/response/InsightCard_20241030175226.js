// InsightCard for key findings

import React from 'react';
import { Card } from '../components/ui/card';

const InsightCard = ({ type, title, description, value, impact }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'neutral':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getImpactIcon = () => {
    if (impact > 0) {
      return '↑';
    } else if (impact < 0) {
      return '↓';
    }
    return '→';
  };

  return (
    <Card className={`p-4 border-l-4 ${getTypeStyles()}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{title}</h4>
        {value && (
          <span className="text-sm font-semibold">
            {getImpactIcon()} {Math.abs(value)}%
          </span>
        )}
      </div>
      <p className="mt-1 text-sm opacity-90">{description}</p>
    </Card>
  );
};

export default InsightCard;
