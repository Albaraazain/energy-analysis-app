import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MessageList from "./MessageList";
import InputArea from "./InputArea";

const ChatInterface = ({ energyData }) => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const chatEndRef = useRef(null);

  // Immediately log initial state
  useEffect(() => {
    console.log("=== CHAT INTERFACE MOUNTED ===");
    console.log("Energy Data:", energyData);
    console.log("GROQ API Key present:", !!process.env.REACT_APP_GROQ_API_KEY);

    setDebugInfo({
      energyDataPresent: !!energyData,
      energyDataLength: energyData?.length || 0,
      apiKeyPresent: !!process.env.REACT_APP_GROQ_API_KEY,
      timestamp: new Date().toISOString(),
    });
  }, [energyData]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewMessage = async (message) => {
    console.log("=== NEW MESSAGE RECEIVED ===");
    console.log("Message:", message);
    console.log("Current State:", {
      messagesCount: messages.length,
      isProcessing,
      energyDataPresent: !!energyData,
    });

    // Update debug info
    setDebugInfo((prev) => ({
      ...prev,
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    }));

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // First, let's validate our setup
      if (!process.env.REACT_APP_GROQ_API_KEY) {
        throw new Error("GROQ API key is not configured");
      }

      if (!energyData || !Array.isArray(energyData)) {
        throw new Error("Energy data is not properly configured");
      }

      console.log("=== PREPARING GROQ REQUEST ===");
      const { default: Groq } = await import("groq-sdk");

      // Initialize Groq
      const groq = new Groq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
      });

      console.log("Groq SDK initialized");

      // Create a simple response first to test the connection
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful energy analysis assistant.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1000,
      });

      console.log("=== GROQ RESPONSE RECEIVED ===");
      console.log("Response:", response);

      // Add system response
      const systemMessage = {
        id: Date.now(),
        type: "system",
        content: response.choices[0].message.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error("=== ERROR IN CHAT INTERFACE ===");
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name,
      });

      // Add error message
      const errorMessage = {
        id: Date.now(),
        type: "system",
        content: `Error: ${error.message}`,
        isError: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Update debug info with error
      setDebugInfo((prev) => ({
        ...prev,
        lastError: error.message,
        errorTime: new Date().toISOString(),
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Debug Panel */}
      <div className="bg-yellow-100 p-2 text-xs font-mono">
        <div>Debug Info:</div>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={chatEndRef} />
      </div>

      <InputArea onSubmit={handleNewMessage} isProcessing={isProcessing} />
    </Card>
  );
};

export default ChatInterface;
