
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';import MessageList from './MessageList';
import InputArea from './InputArea';
import useQueryParser from '../../hooks/useQueryParser';
import useConsumptionAnalysis from '../../hooks/useConsumptionAnalysis';
import useResponseGenerator from '../../hooks/useResponseGenerator';

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);
  
  const { parseQuery, queryResult } = useQueryParser();
  const { analysis, isAnalyzing } = useConsumptionAnalysis(energyData, queryResult?.timeRange);
  const { generateResponse } = useResponseGenerator(analysis, queryResult?.type);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = async (message) => {
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
      // Parse query and generate response
      const parsedQuery = await parseQuery(message);
      
      if (!parsedQuery) {
        throw new Error('Could not understand the query');
      }

      // Wait for analysis
      if (!analysis || isAnalyzing) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Give time for analysis
      }

      // Generate response
      const response = generateResponse();

      // Add system response
      const systemMessage = {
        id: Date.now(),
        type: 'system',
        content: response.text,
        visualizations: response.visualizations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        content: "I'm sorry, I couldn't process that request. Could you rephrase it?",
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
      <div className="flex-1 overflow-y-auto p-4">
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