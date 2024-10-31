import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Groq from 'groq-sdk';

// Initialize Groq client outside component
const groqClient = new Groq({ 
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const completion = await groqClient.chat.completions.create({
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