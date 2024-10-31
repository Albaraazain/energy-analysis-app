// BaselineAnalyzer Class:

// Calculates usage baselines
// Detects patterns in consumption
// Analyzes hourly and daily patterns
// Identifies peak usage periods
// Provides pattern descriptions


// Pattern Analysis Features:

// Hourly patterns (morning, afternoon, evening, night)
// Daily patterns (weekday vs weekend)
// Peak usage detection
// Usage variability analysis

import _ from 'lodash';

class BaselineAnalyzer {
  constructor(data) {
    this.data = data;
    this.baselineCache = new Map();
  }

  // Calculate baseline for different time periods
  calculateBaseline(timeRange, groupingInterval = 'hour') {
    const cacheKey = `${timeRange.start}-${timeRange.end}-${groupingInterval}`;
    
    if (this.baselineCache.has(cacheKey)) {
      return this.baselineCache.get(cacheKey);
    }

    // Group data by the specified interval
    const groupedData = _.groupBy(this.data, (reading) => {
      const date = new Date(reading.timestamp);
      switch (groupingInterval) {
        case 'hour':
          return date.getHours();
        case 'dayOfWeek':
          return date.getDay();
        case 'dayOfMonth':
          return date.getDate();
        default:
          return date.getHours();
      }
    });

    // Calculate averages for each group
    const baseline = _.mapValues(groupedData, (readings) => {
      const values = readings.map(r => r.consumption);
      return {
        average: _.mean(values),
        median: _.sortBy(values)[Math.floor(values.length / 2)],
        stdDev: this.calculateStdDev(values),
        min: _.min(values),
        max: _.max(values),
        samples: values.length
      };
    });

    this.baselineCache.set(cacheKey, baseline);
    return baseline;
  }

  // Calculate standard deviation
  calculateStdDev(values) {
    const mean = _.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(_.mean(squareDiffs));
  }

  // Detect patterns in usage
  detectPatterns(timeRange) {
    const hourlyBaseline = this.calculateBaseline(timeRange, 'hour');
    const dailyBaseline = this.calculateBaseline(timeRange, 'dayOfWeek');

    return {
      hourlyPatterns: this.analyzeHourlyPatterns(hourlyBaseline),
      dailyPatterns: this.analyzeDailyPatterns(dailyBaseline),
      peakUsagePeriods: this.findPeakPeriods(hourlyBaseline)
    };
  }

  // Analyze hourly consumption patterns
  analyzeHourlyPatterns(hourlyBaseline) {
    const periods = {
      morning: _.range(6, 12),    // 6 AM - 12 PM
      afternoon: _.range(12, 17),  // 12 PM - 5 PM
      evening: _.range(17, 22),    // 5 PM - 10 PM
      night: [..._.range(22, 24), ..._.range(0, 6)] // 10 PM - 6 AM
    };

    return _.mapValues(periods, hours => {
      const relevantData = hours.map(hour => hourlyBaseline[hour]?.average || 0);
      return {
        averageUsage: _.mean(relevantData),
        totalHours: hours.length,
        peak: _.max(relevantData),
        description: this.describePeriodUsage(relevantData)
      };
    });
  }

  // Analyze daily patterns
  analyzeDailyPatterns(dailyBaseline) {
    const weekdays = _.range(1, 6);  // Monday to Friday
    const weekend = [0, 6];          // Sunday and Saturday

    return {
      weekday: {
        average: _.mean(weekdays.map(day => dailyBaseline[day]?.average || 0)),
        pattern: this.describeDayPattern(weekdays, dailyBaseline)
      },
      weekend: {
        average: _.mean(weekend.map(day => dailyBaseline[day]?.average || 0)),
        pattern: this.describeDayPattern(weekend, dailyBaseline)
      }
    };
  }

  // Find peak usage periods
  findPeakPeriods(hourlyBaseline) {
    const threshold = _.mean(Object.values(hourlyBaseline).map(data => data.average)) * 1.5;
    
    return Object.entries(hourlyBaseline)
      .filter(([, data]) => data.average > threshold)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        usage: data.average,
        frequency: data.samples,
        significance: (data.average - threshold) / threshold
      }))
      .sort((a, b) => b.significance - a.significance);
  }

  // Generate description for period usage
  describePeriodUsage(values) {
    const average = _.mean(values);
    const max = _.max(values);
    const min = _.min(values);
    
    if (max > average * 1.5) return 'High variability with significant peaks';
    if (max < average * 1.2) return 'Consistent usage pattern';
    return 'Moderate variation in usage';
  }

  // Generate description for daily patterns
  describeDayPattern(days, baseline) {
    const values = days.map(day => baseline[day]?.average || 0);
    const average = _.mean(values);
    const variation = this.calculateStdDev(values) / average;

    if (variation < 0.1) return 'Very consistent day-to-day usage';
    if (variation < 0.2) return 'Fairly consistent usage with some variation';
    return 'Highly variable day-to-day usage';
  }

  // Compare usage against baseline
  compareToBaseline(readings, baseline) {
    return readings.map(reading => {
      const hour = new Date(reading.timestamp).getHours();
      const baselineForHour = baseline[hour];

      if (!baselineForHour) return null;

      const deviation = (reading.consumption - baselineForHour.average) / baselineForHour.stdDev;
      
      return {
        ...reading,
        baselineAverage: baselineForHour.average,
        deviation,
        isAnomaly: Math.abs(deviation) > 2, // More than 2 standard deviations
        percentageDiff: ((reading.consumption - baselineForHour.average) / baselineForHour.average) * 100
      };
    }).filter(Boolean);
  }
}

export default BaselineAnalyzer;