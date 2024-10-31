// Energy reading data structure
export const createEnergyReading = (timestamp, consumption) => {
    return {
      timestamp: new Date(timestamp),
      consumption: Number(consumption)
    };
  };
  
  // Time range structure
  export const createTimeRange = (start, end) => {
    return {
      start: new Date(start),
      end: new Date(end)
    };
  };
  
  // Message structure for chat
  export const createMessage = (content, type = 'user') => {
    return {
      id: Date.now().toString(),
      content,
      type, // 'user' or 'system'
      timestamp: new Date(),
      metadata: {} // For additional data like analysis results
    };
  };
  
  // Analysis result structure
  export const createAnalysisResult = (timeRange, data) => {
    return {
      timeRange,
      actualConsumption: data.reduce((sum, reading) => sum + reading.consumption, 0),
      averageHourly: data.reduce((sum, reading) => sum + reading.consumption, 0) / data.length,
      readings: data,
      summary: null  // Will be filled by analysis engine
    };
  };
  
  // Validation functions
  export const isValidEnergyReading = (reading) => {
    return (
      reading &&
      reading.timestamp instanceof Date &&
      !isNaN(reading.timestamp) &&
      typeof reading.consumption === 'number' &&
      !isNaN(reading.consumption) &&
      reading.consumption >= 0
    );
  };
  
  export const isValidTimeRange = (range) => {
    return (
      range &&
      range.start instanceof Date &&
      range.end instanceof Date &&
      !isNaN(range.start) &&
      !isNaN(range.end) &&
      range.start <= range.end
    );
  };
  
  // Helper function to validate and clean data
  export const cleanEnergyData = (rawData) => {
    return rawData
      .map(row => {
        try {
          const reading = createEnergyReading(row.timestamp, row.consumption);
          return isValidEnergyReading(reading) ? reading : null;
        } catch (error) {
          console.error('Error cleaning data row:', error);
          return null;
        }
      })
      .filter(reading => reading !== null);
  };
  
  // Data aggregation helpers
  export const aggregateReadings = (readings, interval = 'hour') => {
    const grouped = readings.reduce((acc, reading) => {
      let key;
      const date = reading.timestamp;
  
      switch (interval) {
        case 'hour':
          key = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
          break;
        case 'day':
          key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
          break;
        default:
          key = date.getTime();
      }
  
      if (!acc[key]) {
        acc[key] = {
          timestamp: new Date(key),
          readings: [],
          total: 0,
          count: 0
        };
      }
  
      acc[key].readings.push(reading);
      acc[key].total += reading.consumption;
      acc[key].count += 1;
  
      return acc;
    }, {});
  
    return Object.values(grouped).map(group => ({
      timestamp: group.timestamp,
      consumption: group.total / group.count
    }));
  };