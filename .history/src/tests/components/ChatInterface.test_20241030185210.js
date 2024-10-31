import React, { useState, useRef, useEffect } from 'react';
import Groq from "groq-sdk";
import { Card } from '@/components/ui/card';
import MessageList from './MessageList';
import InputArea from './InputArea';

// Debug flag - set to true to see debug logs
const DEBUG = true;

const debugLog = (...args) => {
  if (DEBUG) {
    console.log('[ChatInterface Debug]:', ...args);
  }
};

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Debug: Log when component mounts and when energyData changes
  useEffect(() => {
    debugLog('Component mounted with energyData:', energyData);
  }, [energyData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateSystemPrompt = () => {
    try {
      debugLog('Generating system prompt with energyData:', 
        energyData ? energyData.length : 'no data');

      if (!energyData || !Array.isArray(energyData) || energyData.length === 0) {
        throw new Error('Invalid or empty energyData');
      }

      const dataRange = {
        start: new Date(energyData[0].timestamp),
        end: new Date(energyData[energyData.length - 1].timestamp)
      };

      const prompt = `You are an energy analysis assistant helping users understand their energy consumption patterns.

Available data range: ${dataRange.start.toLocaleDateString()} to ${dataRange.end.toLocaleDateString()}
Number of readings: ${energyData.length}

Sample of current data:
${JSON.stringify(energyData.slice(0, 3), null, 2)}

When analyzing, consider:
1. Daily and weekly patterns
2. Unusual spikes or drops
3. Comparison with typical usage
4. Potential energy-saving opportunities

Respond conversationally but include specific numbers when relevant.`;

      debugLog('Generated system prompt:', prompt);
      return prompt;
    } catch (error) {
      debugLog('Error generating system prompt:', error);
      throw error;
    }
  };

  const handleNewMessage = async (message) => {
    debugLog('Handling new message:', message);
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      debugLog('Checking Groq API key:', process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'Present' : 'Missing');
      
      // Initialize Groq with API key
      const groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      });

      // Format conversation history
      const formattedHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      debugLog('Formatted history:', formattedHistory);

      // Prepare messages array for API call
      const apiMessages = [
        {
          role: "system",
          content: generateSystemPrompt()
        },
        ...formattedHistory,
        {
          role: "user",
          content: message
        }
      ];

      debugLog('Sending request to Groq API with messages:', apiMessages);

      // Create completion request
      const completion = await groq.chat.completions.create({
        messages: apiMessages,
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      });

      debugLog('Received response from Groq:', completion);

      // Add system response
      const systemMessage = {
        id: Date.now(),
        type: 'system',
        content: completion.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

    } catch (error) {
      debugLog('Error in handleNewMessage:', error);
      console.error('Detailed error:', error);
      
      // Create more informative error message
      let errorMessage = {
        id: Date.now(),
        type: 'system',
        content: error.message || "An error occurred while processing your request.",
        isError: true,
        timestamp: new Date()
      };

      // Add more specific error messages based on error type
      if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
        errorMessage.content = "API key is missing. Please check your environment configuration.";
      } else if (error.message.includes('API key')) {
        errorMessage.content = "Invalid API key. Please check your configuration.";
      } else if (error.message.includes('network')) {
        errorMessage.content = "Network error occurred. Please check your internet connection.";
      }

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Debug: Log whenever messages state changes
  useEffect(() => {
    debugLog('Messages updated:', messages);
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Debug info at the top if DEBUG is true */}
        {DEBUG && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <div>Energy Data Points: {energyData?.length || 0}</div>
            <div>API Key Present: {process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'Yes' : 'No'}</div>
            <div>Message Count: {messages.length}</div>
          </div>
        )}
        <MessageList messages={messages} />
        <div ref={chatEndRef} />
      </div>
      <InputArea 
        onSubmit={handleNewMessage}
        isProcessing={isProcessing}
      />
    </Card>
  );
};

export default ChatInterface;