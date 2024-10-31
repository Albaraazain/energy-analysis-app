import React, { useState, useEffect } from 'react';
import { EnergyAnalysisProvider } from '../context/EnergyAnalysisContext';
import ChatInterface from '../components/chat/chatInterface';
import VisualizationContainer from '../components/visualization/VisualizationContainer';
import { Card } from '../components/ui/card';

// Sample data (normally this would come from your CSV)
const SAMPLE_DATA = [
  { timestamp: '2024-01-01T00:00:00', consumption: 2.5 },
  { timestamp: '2024-01-01T01:00:00', consumption: 2.3 },
  { timestamp: '2024-01-01T02:00:00', consumption: 2.1 },
  { timestamp: '2024-01-01T03:00:00', consumption: 2.0 },
  { timestamp: '2024-01-01T04:00:00', consumption: 1.9 },
  { timestamp: '2024-01-01T05:00:00', consumption: 2.0 },
  { timestamp: '2024-01-01T06:00:00', consumption: 2.8 },
  { timestamp: '2024-01-01T07:00:00', consumption: 3.5 },
  { timestamp: '2024-01-01T08:00:00', consumption: 4.2 },
  { timestamp: '2024-01-01T09:00:00', consumption: 4.5 },
  { timestamp: '2024-01-01T10:00:00', consumption: 4.3 },
  { timestamp: '2024-01-01T11:00:00', consumption: 3.8 },
  { timestamp: '2024-01-01T12:00:00', consumption: 2.9 }
].map(reading => ({
  ...reading,
  timestamp: new Date(reading.timestamp),
  consumption: Number(reading.consumption)
}));

const EnergyDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(SAMPLE_DATA);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
              onRefresh={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 500);
              }}
            />
          </div>
        </div>
      </div>
    </EnergyAnalysisProvider>
  );
};

export default EnergyDashboard;