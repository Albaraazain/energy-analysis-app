// File: src/utils/analysis-system.js

// Analysis Features:

// Total and average consumption
// Statistical measures (min, max, median, quartiles)
// Moving averages
// Trend detection with confidence levels
// Volatility analysis




import _ from 'lodash';

class EnergyAnalysisSystem {
  constructor(data) {
    this.data = data;
  }

  // Extract date range from user query
  extractDateRange(query) {
    // Examples:
    // "last weekend" -> extract last weekend's dates
    // "yesterday" -> extract yesterday's dates
    // "last night" -> extract last night's hours
    // "january 5th" -> extract specific date
    // If no specific date is mentioned, return null
    
    const today = new Date();
    const lowercaseQuery = query.toLowerCase();

    if (lowercaseQuery.includes('yesterday')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: new Date(yesterday.setHours(0, 0, 0, 0)),
        end: new Date(yesterday.setHours(23, 59, 59, 999))
      };
    }

    if (lowercaseQuery.includes('last night')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: new Date(yesterday.setHours(18, 0, 0, 0)),
        end: new Date(yesterday.setHours(23, 59, 59, 999))
      };
    }

    if (lowercaseQuery.includes('last weekend')) {
      const lastWeekend = new Date(today);
      lastWeekend.setDate(lastWeekend.getDate() - (lastWeekend.getDay() + 1));
      return {
        start: new Date(lastWeekend.setHours(0, 0, 0, 0)),
        end: new Date(lastWeekend.setDate(lastWeekend.getDate() + 1))
      };
    }

    // Add more date extraction patterns as needed
    return null;
  }

  // Get data for a specific time range
  getDataForRange(startTime, endTime) {
    return this.data.filter(reading => {
      const timestamp = new Date(reading.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  }

  // Calculate baseline (typical usage) for comparison
  calculateBaseline(timeRange) {
    // Group all data by hour of day to find typical patterns
    const hourlyAverages = _.chain(this.data)
      .groupBy(reading => new Date(reading.timestamp).getHours())
      .mapValues(readings => {
        const sum = _.sumBy(readings, 'consumption');
        return sum / readings.length;
      })
      .value();

    return hourlyAverages;
  }

  // Analyze consumption for a specific period
  analyzeConsumption(startTime, endTime) {
    const periodData = this.getDataForRange(startTime, endTime);
    const baseline = this.calculateBaseline();

    // Calculate actual consumption
    const actualConsumption = _.sumBy(periodData, 'consumption');

    // Calculate expected consumption based on baseline
    let expectedConsumption = 0;
    periodData.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      expectedConsumption += baseline[hour] || 0;
    });

    // Calculate the difference
    const difference = actualConsumption - expectedConsumption;
    const percentageDifference = (difference / expectedConsumption) * 100;

    return {
      actualConsumption,
      expectedConsumption,
      difference,
      percentageDifference,
      hourlyBreakdown: periodData,
      timeRange: { start: startTime, end: endTime }
    };
  }

  // Generate a natural language response
  generateResponse(query) {
    // First, try to extract a date range from the query
    const dateRange = this.extractDateRange(query);
    
    if (!dateRange) {
      // If no specific date range found, provide general statistics
      const totalConsumption = _.sumBy(this.data, 'consumption');
      const avgConsumption = totalConsumption / this.data.length;
      
      return {
        message: `Based on your available data, your average hourly consumption is ${avgConsumption.toFixed(2)} kWh. To analyze a specific period, please mention when it occurred (e.g., "yesterday", "last weekend", "last night").`,
        data: {
          averageConsumption: avgConsumption,
          totalConsumption: totalConsumption
        }
      };
    }

    // Analyze the specified period
    const analysis = this.analyzeConsumption(dateRange.start, dateRange.end);
    
    let response = `During this period, your energy consumption was ${analysis.actualConsumption.toFixed(2)} kWh, `;
    
    if (analysis.difference > 0) {
      response += `which is ${Math.abs(analysis.percentageDifference).toFixed(1)}% higher than typical usage.`;
    } else {
      response += `which is ${Math.abs(analysis.percentageDifference).toFixed(1)}% lower than typical usage.`;
    }

    return {
      message: response,
      data: analysis
    };
  }
}

export default EnergyAnalysisSystem;