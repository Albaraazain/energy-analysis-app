import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { loadEnergyData } from './utils/data-loader';
import { formatDate } from './utils/date-utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EnergyAnalysisApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [energyData, setEnergyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadEnergyData('energy_data.csv');
        setEnergyData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load energy data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // TODO: In next phase, we'll add agent processing here
    const mockResponse = {
      type: 'system',
      content: 'I understand you want to know about your energy usage. This feature will be implemented in the next phase.',
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, mockResponse]);
    }, 1000);

    setInputValue('');
  };

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
                  {/* Messages */}
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
                          <div className="text-xs mt-1 opacity-75">
                            {formatDate(new Date(message.timestamp))}
                          </div>
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
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask about your energy usage..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
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
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      Loading data...
                    </div>
                  ) : error ? (
                    <div className="h-full flex items-center justify-center text-red-500">
                      {error}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={500}>
                      <LineChart data={energyData}>
                        <XAxis 
                          dataKey="timestamp" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return `${date.getHours()}:00`;
                          }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          label={{ 
                            value: 'kWh', 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                        />
                        <Tooltip
                          labelFormatter={(timestamp) => formatDate(new Date(timestamp))}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="consumption" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
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