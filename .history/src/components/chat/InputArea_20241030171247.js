# File: src/components/chat/InputArea.js

import React, { useState, useRef, useEffect } from 'react';

const InputArea = ({ onSubmit, isProcessing }) => {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to get actual scroll height
      textareaRef.current.style.height = 'auto';
      
      const newRows = Math.min(
        Math.ceil(textareaRef.current.scrollHeight / 24), // Line height is 24px
        5 // Max 5 rows
      );
      
      setRows(newRows);
      textareaRef.current.style.height = `${newRows * 24}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;

    try {
      await onSubmit(input.trim());
      setInput('');
      setRows(1);
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={rows}
            placeholder={
              isProcessing
                ? "Processing your request..."
                : "Ask about your energy usage..."
            }
            disabled={isProcessing}
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none 
                     focus:border-blue-500 resize-none disabled:bg-gray-50
                     disabled:text-gray-500"
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {input.length}/500
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className={`px-6 py-2 rounded-lg text-white font-medium
                    transition-colors focus:outline-none
                    ${
                      !input.trim() || isProcessing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Processing
            </span>
          ) : (
            'Send'
          )}
        </button>
      </form>

      {/* Suggested queries */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput("How much energy did I use yesterday?")}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 
                   hover:bg-gray-200 text-gray-600 transition-colors"
        >
          Yesterday's usage
        </button>
        <button
          onClick={() => setInput("What's my typical daily consumption?")}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 
                   hover:bg-gray-200 text-gray-600 transition-colors"
        >
          Typical usage
        </button>
        <button
          onClick={() => setInput("Any unusual consumption patterns?")}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 
                   hover:bg-gray-200 text-gray-600 transition-colors"
        >
          Unusual patterns
        </button>
      </div>
    </div>
  );
};

export default InputArea;