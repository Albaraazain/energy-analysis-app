import React from 'react';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Main App Component
const EnergyAnalysisApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Smart Energy Analysis
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat and Analysis Section */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardContent className="flex-1 overflow-auto p-4">
                  {/* Messages will go here */}
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-3/4 rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about your energy usage..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (inputValue.trim()) {
                          setMessages([
                            ...messages,
                            { type: 'user', content: inputValue },
                          ]);
                          setInputValue('');
                        }
                      }}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Visualization Section */}
            <div className="lg:col-span-1">
              <Card className="h-[600px]">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Energy Usage Overview
                  </h2>
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Visualization will be added here
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnergyAnalysisApp;