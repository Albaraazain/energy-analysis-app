# File: src/components/chat/Message.js

import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import VisualizationRenderer from '../visualization/VisualizationRenderer';

const Message = ({ message }) => {
  const {
    type,
    content,
    timestamp,
    visualizations,
    isError
  } = message;

  const isSystem = type === 'system';

  return (
    <div
      className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}
    >
      <div className="max-w-[80%]">
        {/* Message Content */}
        <div
          className={`rounded-lg p-4 ${
            isSystem
              ? isError
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-100 text-gray-900'
              : 'bg-blue-500 text-white'
          }`}
        >
          {/* Message Text */}
          <div className="text-sm whitespace-pre-wrap">{content}</div>

          {/* Timestamp */}
          <div className="text-xs mt-2 opacity-75">
            {formatDate(new Date(timestamp))}
          </div>

          {/* Visualizations */}
          {visualizations && visualizations.length > 0 && (
            <div className="mt-4 space-y-4">
              {visualizations.map((viz, index) => (
                <VisualizationRenderer
                  key={index}
                  visualization={viz}
                />
              ))}
            </div>
          )}
        </div>

        {/* Suggested Actions (for system messages) */}
        {isSystem && !isError && message.actions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.handler()}
                className="text-sm px-3 py-1 rounded-full bg-gray-200 
                         hover:bg-gray-300 text-gray-700 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;