// utils/data-loader.js
import Papa from 'papaparse';

export const loadEnergyData = async (file) => {
  try {
    const response = await window.fs.readFile(file, { encoding: 'utf8' });
    const parseResult = Papa.parse(response, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    return parseResult.data.map(row => ({
      timestamp: row.timestamp,
      consumption: row.consumption,
      event: row.event || undefined
    }));
  } catch (error) {
    console.error('Error loading energy data:', error);
    throw error;
  }
};

// utils/date-utils.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const parseTimestamp = (timestamp) => {
  return new Date(timestamp);
};

// utils/analysis-utils.js
export const calculateAverageConsumption = (data, startTime, endTime) => {
  const filteredData = data.filter(reading => {
    const timestamp = new Date(reading.timestamp);
    return timestamp >= startTime && timestamp <= endTime;
  });
  
  const sum = filteredData.reduce((acc, reading) => acc + reading.consumption, 0);
  return filteredData.length ? sum / filteredData.length : 0;
};

export const findEvents = (data, startTime, endTime) => {
  return data.filter(reading => {
    const timestamp = new Date(reading.timestamp);
    return timestamp >= startTime && 
           timestamp <= endTime && 
           reading.event;
  });
};

export const compareTimeRanges = (data, range1Start, range1End, range2Start, range2End) => {
  const range1Avg = calculateAverageConsumption(data, range1Start, range1End);
  const range2Avg = calculateAverageConsumption(data, range2Start, range2End);
  
  return {
    range1Average: range1Avg,
    range2Average: range2Avg,
    difference: range1Avg - range2Avg,
    percentageChange: ((range1Avg - range2Avg) / range2Avg) * 100
  };
};