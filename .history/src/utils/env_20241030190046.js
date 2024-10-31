// src/utils/env.js

export const validateEnv = () => {
    const required = ['NEXT_PUBLIC_GROQ_API_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  
    return {
      GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY
    };
  };