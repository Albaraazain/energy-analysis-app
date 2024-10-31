import React, { useState, useRef, useEffect } from 'react';
import Groq from "groq-sdk";
import { Card } from '@/components/ui/card';
import MessageList from './MessageList';
import InputArea from './InputArea';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, 
});

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate system prompt based on available data
  const generateSystemPrompt = () => {
    const dataRange = {
      start: new Date(energyData[0].timestamp),
      end: new Date(energyData[energyData.length - 1].timestamp)
    };
    
    return `You are an energy analysis assistant. You help users understand their energy consumption patterns and provide insights.

Available data range: ${dataRange.start.toLocaleDateString()} to ${dataRange.end.toLocaleDateString()}
Number of readings: ${energyData.length}

Current energy data summary:
${JSON.stringify(energyData.slice(0, 5), null, 2)}
...and ${energyData.length - 5} more readings

When analyzing the data, consider:
1. Daily and weekly patterns
2. Unusual spikes or drops
3. Comparison with typical usage
4. Potential energy-saving opportunities

Always provide specific numerical insights when relevant.`;
  };

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
      // Format conversation history for the model
      const formattedHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Create completion request
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: generateSystemPrompt()
          },
          ...formattedHistory,
          {
            role: "user",
            content: message
          }
        ],
        model: "mixtral-8x7b-32768", // You can also try "llama-3.1-70b-versatile"
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      });

      // Add system response
      const systemMessage = {
        id: Date.now(),
        type: 'system',
        content: completion.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

    } catch (error) {
      console.error('Error processing message with Groq:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
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