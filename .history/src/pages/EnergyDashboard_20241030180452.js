import React from 'react';
import { EnergyAnalysisProvider } from '../context/EnergyAnalysisContext';
import ChatInterface from '../components/chat/chatInterface';
import VisualizationContainer from '../components/visualization/VisualizationContainer';
import { Card } from '../components/ui/card';
import useEnergyData from '../hooks/useEnergyData';

const EnergyDashboard = () => {
  const {
    data,
    isLoading,
    error,
    refreshData
  } = useEnergyData('energy_data.csv');

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-red-600">
            Error loading energy data: {error.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <EnergyAnalysisProvider>
      <div className="space-y-6">
        {/* Main content wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section - Chat interface */}
          <div className="lg:col-span-2">
            <ChatInterface energyData={data} />
          </div>

          {/* Right section - Visualizations */}
          <div className="lg:col-span-1">
            <VisualizationContainer 
              data={data} 
              isLoading={isLoading}
              onRefresh={refreshData}
            />
          </div>
        </div>
      </div>
    </EnergyAnalysisProvider>
  );
};

export default EnergyDashboard;