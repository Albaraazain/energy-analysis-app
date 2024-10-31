import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { validateEnv } from '../utils/env';

const debugLog = (...args) => {
  console.log('%c[ChatDebug]', 'background: #ffd700; color: black; padding: 2px 4px; border-radius: 2px;', ...args);
};

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [envStatus, setEnvStatus] = useState({ isValid: false, error: null });
  const chatEndRef = useRef(null);

  // Validate environment on mount
  useEffect(() => {
    try {
      const env = validateEnv();
      console.log('Environment validated successfully');
      console.log('API Key (first 4 chars):', env.GROQ_API_KEY.substring(0, 4) + '...');
      setEnvStatus({ isValid: true, error: null });
    } catch (error) {
      console.error('Environment validation failed:', error);
      setEnvStatus({ isValid: false, error: error.message });
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = async (message) => {
    debugLog('New message:', message);
    
    if (!envStatus.isValid) {
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        content: 'Configuration error: ' + envStatus.error,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const { default: Groq } = await import('groq-sdk');
      
      // Initialize Groq with validated API key
      const groq = new Groq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY
      });

      debugLog('Sending request to Groq');
      
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an energy analysis assistant. Be concise but helpful."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1000
      });

      debugLog('Received response from Groq');

      const systemMessage = {
        id: Date.now(),
        type: 'system',
        content: completion.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        content: `Error: ${error.message}`,
        isError: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Environment Status Banner */}
      {!envStatus.isValid && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Configuration Error</p>
          <p>{envStatus.error}</p>
          <p className="text-sm mt-2">
            Please create a .env.local file in your project root with:
            NEXT_PUBLIC_GROQ_API_KEY=your-api-key-here
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={chatEndRef} />
      </div>

      <InputArea 
        onSubmit={handleNewMessage}
        isProcessing={isProcessing}
        disabled={!envStatus.isValid}
      />
    </Card>
  );
};

export default ChatInterface;
