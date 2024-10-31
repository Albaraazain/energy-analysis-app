
import React, { memo } from 'react';
import { Card } from '../ui/card';
// Skeleton loading for chat messages
export const MessageSkeleton = memo(() => (
  <div className="animate-pulse space-y-3">
    <div className="flex justify-start">
      <div className="bg-gray-200 rounded-lg p-3 w-2/3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
      </div>
    </div>
    <div className="flex justify-end">
      <div className="bg-blue-100 rounded-lg p-3 w-2/3">
        <div className="h-4 bg-blue-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
));

// Skeleton loading for visualizations
export const ChartSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg"></div>
    <div className="mt-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
));

// Loading overlay for async operations
export const LoadingOverlay = memo(({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                  justify-center z-50">
    <Card className="p-6 bg-white">
      <div className="flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-gray-700">{message}</p>
      </div>
    </Card>
  </div>
));

// Progressive loading indicator
export const ProgressiveLoader = memo(({ progress }) => (
  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-500 transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
));

