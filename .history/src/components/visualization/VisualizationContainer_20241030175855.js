
import React from 'react';

import EnergyChart from '../charts/EnergyChart';
import EnergyStats from '../stats/EnergyStats';
import useEnergyData from '../../hooks/useEnergyData';

import { Card } from '../ui/card';

const VisualizationContainer = () => {
  const {
    data,
    isLoading,
    error,
    stats,
    refreshData
  } = useEnergyData('energy_data.csv');

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Energy Overview
            </h3>
            <button
              onClick={refreshData}
              className="text-sm text-blue-600 hover:text-blue-500"
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
          <EnergyStats data={data} />
        </div>
      </div>

      {/* Chart Section */}
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Consumption Timeline
          </h3>
          <EnergyChart
            data={data}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </Card>

      {/* Data Quality Indicators */}
      {stats && (stats.hasGaps || stats.hasAnomalies) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Data Quality Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                {stats.hasGaps && (
                  <p>Some data points may be missing from the timeline.</p>
                )}
                {stats.hasAnomalies && (
                  <p>Unusual consumption patterns detected in the data.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationContainer;