# File: src/context/EnergyAnalysisContext.js

import React, { createContext, useContext, useReducer, useMemo } from 'react';

// Initial state
const initialState = {
  energyData: [],
  isLoading: false,
  error: null,
  currentQuery: null,
  analysisResults: null,
  timeRange: {
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    end: new Date()
  },
  selectedView: 'chat', // 'chat' or 'analysis'
};

// Action types
const ACTION_TYPES = {
  SET_ENERGY_DATA: 'SET_ENERGY_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUERY: 'SET_QUERY',
  SET_ANALYSIS_RESULTS: 'SET_ANALYSIS_RESULTS',
  SET_TIME_RANGE: 'SET_TIME_RANGE',
  SET_VIEW: 'SET_VIEW',
  RESET_ERROR: 'RESET_ERROR'
};

// Reducer function
const energyAnalysisReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ENERGY_DATA:
      return {
        ...state,
        energyData: action.payload,
        error: null
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ACTION_TYPES.SET_QUERY:
      return {
        ...state,
        currentQuery: action.payload,
        error: null
      };

    case ACTION_TYPES.SET_ANALYSIS_RESULTS:
      return {
        ...state,
        analysisResults: action.payload,
        error: null
      };

    case ACTION_TYPES.SET_TIME_RANGE:
      return {
        ...state,
        timeRange: action.payload
      };

    case ACTION_TYPES.SET_VIEW:
      return {
        ...state,
        selectedView: action.payload
      };

    case ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const EnergyAnalysisContext = createContext(null);

// Context provider
export const EnergyAnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(energyAnalysisReducer, initialState);

  // Memoize context value
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    
    // Action creators
    actions: {
      setEnergyData: (data) => dispatch({
        type: ACTION_TYPES.SET_ENERGY_DATA,
        payload: data
      }),

      setLoading: (isLoading) => dispatch({
        type: ACTION_TYPES.SET_LOADING,
        payload: isLoading
      }),

      setError: (error) => dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: error
      }),

      setQuery: (query) => dispatch({
        type: ACTION_TYPES.SET_QUERY,
        payload: query
      }),

      setAnalysisResults: (results) => dispatch({
        type: ACTION_TYPES.SET_ANALYSIS_RESULTS,
        payload: results
      }),

      setTimeRange: (timeRange) => dispatch({
        type: ACTION_TYPES.SET_TIME_RANGE,
        payload: timeRange
      }),

      setView: (view) => dispatch({
        type: ACTION_TYPES.SET_VIEW,
        payload: view
      }),

      resetError: () => dispatch({
        type: ACTION_TYPES.RESET_ERROR
      })
    }
  }), [state, dispatch]);

  return (
    <EnergyAnalysisContext.Provider value={contextValue}>
      {children}
    </EnergyAnalysisContext.Provider>
  );
};

// Custom hook for using the context
export const useEnergyAnalysis = () => {
  const context = useContext(EnergyAnalysisContext);
  if (!context) {
    throw new Error('useEnergyAnalysis must be used within an EnergyAnalysisProvider');
  }
  return context;
};