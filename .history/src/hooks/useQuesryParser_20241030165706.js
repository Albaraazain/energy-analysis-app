# File: src/hooks/useQueryParser.js

import { useState, useCallback } from 'react';
import { QueryParser, QUERY_TYPES } from '../utils/queryParser';

const queryParser = new QueryParser();

const useQueryParser = () => {
  const [queryResult, setQueryResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const parseQuery = useCallback((query) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Parse the query
      const result = queryParser.parseQuery(query);
      
      // Validate the result
      if (result.confidence < 0.4) { // Less than 40% confidence
        setError({
          type: 'low_confidence',
          message: 'I\'m not sure I understood that correctly. Could you rephrase your question?'
        });
        setQueryResult(null);
        return null;
      }

      setQueryResult(result);
      return result;

    } catch (err) {
      setError({
        type: 'parsing_error',
        message: 'Sorry, I had trouble understanding that query.'
      });
      setQueryResult(null);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getQueryDescription = useCallback((result) => {
    if (!result) return '';

    const timeRange = result.timeRange;
    const startDate = timeRange.start.toLocaleDateString();
    const endDate = timeRange.end.toLocaleDateString();

    switch (result.type) {
      case QUERY_TYPES.USAGE_INQUIRY:
        return `Checking energy usage from ${startDate} to ${endDate}`;
      
      case QUERY_TYPES.COMPARISON:
        return `Comparing energy usage for period ${startDate} to ${endDate}`;
      
      case QUERY_TYPES.PATTERN:
        return `Analyzing usage patterns from ${startDate} to ${endDate}`;
      
      case QUERY_TYPES.ANOMALY:
        return `Looking for unusual consumption patterns between ${startDate} and ${endDate}`;
      
      default:
        return `Analyzing energy data from ${startDate} to ${endDate}`;
    }
  }, []);

  const getSuggestedQueries = useCallback((error) => {
    if (error?.type === 'low_confidence') {
      return [
        "How much energy did I use yesterday?",
        "Was my usage higher than normal last week?",
        "What's my typical daily consumption?",
        "Any unusual usage patterns this month?"
      ];
    }
    return [];
  }, []);

  return {
    parseQuery,
    queryResult,
    isProcessing,
    error,
    getQueryDescription,
    getSuggestedQueries
  };
};

export default useQueryParser;