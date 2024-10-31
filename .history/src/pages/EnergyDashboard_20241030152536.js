import React from 'react';
import { Card } from '../components/ui/card';

const EnergyDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Main content wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section - Will contain chat interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Energy Analysis Chat
              </h2>
              {/* Chat interface will be added here */}
              <div className="text-gray-500">
                Chat interface coming soon...
              </div>
            </div>
          </Card>
        </div>

        {/* Right section - Will contain visualizations */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Energy Usage Overview
              </h2>
              {/* Visualization will be added here */}
              <div className="text-gray-500">
                Visualization coming soon...
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
