# File: src/components/stats/EnergyStats.js

import React from 'react';
import { Card } from '../components/ui/card';

const StatCard = ({ title, value, unit, description }) => (
  <Card className="p-4">
    <div className="text-sm font-medium text-gray-500">{title}</div>
    <div className="mt-1 flex items-baseline">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {unit && <div className="ml-2 text-sm text-gray-500">{unit}</div>}
    </div>
    {description && (
      <div className="mt-1 text-sm text-gray-500">{description}</div>
    )}
  </Card>
);

const EnergyStats = ({ data }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data || data.length === 0) return null;

    const consumption = data.map(d => d.consumption);
    const total = consumption.reduce((sum, val) => sum + val, 0);
    const average = total / consumption.length;
    const max = Math.max(...consumption);
    const min = Math.min(...consumption);

    return {
      total: total.toFixed(2),
      average: average.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
      readings: data.length
    };
  }, [data]);

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Consumption"
        value={stats.total}
        unit="kWh"
        description="Total energy used in this period"
      />
      <StatCard
        title="Average Usage"
        value={stats.average}
        unit="kWh"
        description="Average hourly consumption"
      />
      <StatCard
        title="Peak Usage"
        value={stats.max}
        unit="kWh"
        description="Highest recorded consumption"
      />
    </div>
  );
};

export default EnergyStats;