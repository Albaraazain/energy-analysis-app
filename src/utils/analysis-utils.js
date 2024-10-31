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