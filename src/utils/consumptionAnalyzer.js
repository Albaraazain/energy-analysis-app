// ConsumptionAnalyzer Class:

// Detailed consumption analysis
// Statistical calculations
// Trend detection
// Variability analysis
// Pattern recognition

import _ from 'lodash';

class ConsumptionAnalyzer {
  constructor(data) {
    this.data = data;
  }

  // Analyze consumption for a specific time period
  analyzeTimeRange(startTime, endTime) {
    const periodData = this.getDataInRange(startTime, endTime);
    
    if (periodData.length === 0) {
      return {
        error: 'No data available for the specified time range'
      };
    }

    const analysis = {
      totalConsumption: this.calculateTotal(periodData),
      averageConsumption: this.calculateAverage(periodData),
      statistics: this.calculateStatistics(periodData),
      trends: this.analyzeTrends(periodData),
      summary: this.generateSummary(periodData)
    };

    return analysis;
  }

  // Get data within a specific time range
  getDataInRange(startTime, endTime) {
    return this.data.filter(reading => {
      const timestamp = new Date(reading.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  }

  // Calculate total consumption
  calculateTotal(data) {
    return _.sumBy(data, 'consumption');
  }

  // Calculate average consumption
  calculateAverage(data) {
    return this.calculateTotal(data) / data.length;
  }

  // Calculate detailed statistics
  calculateStatistics(data) {
    const values = data.map(d => d.consumption);
    const sorted = _.sortBy(values);
    
    return {
      min: _.min(values),
      max: _.max(values),
      median: sorted[Math.floor(sorted.length / 2)],
      q1: sorted[Math.floor(sorted.length / 4)],
      q3: sorted[Math.floor(3 * sorted.length / 4)],
      standardDeviation: this.calculateStandardDeviation(values),
      variance: this.calculateVariance(values)
    };
  }

  // Calculate standard deviation
  calculateStandardDeviation(values) {
    const variance = this.calculateVariance(values);
    return Math.sqrt(variance);
  }

  // Calculate variance
  calculateVariance(values) {
    const mean = _.mean(values);
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return _.mean(squaredDiffs);
  }

  // Analyze consumption trends
  analyzeTrends(data) {
    const hourlyAverages = this.groupByHour(data);
    const movingAverage = this.calculateMovingAverage(data, 3); // 3-hour moving average
    
    return {
      hourlyPattern: hourlyAverages,
      movingAverage,
      trend: this.detectTrend(data),
      variability: this.analyzeVariability(data)
    };
  }

  // Group data by hour and calculate averages
  groupByHour(data) {
    return _.chain(data)
      .groupBy(d => new Date(d.timestamp).getHours())
      .mapValues(group => ({
        average: _.meanBy(group, 'consumption'),
        count: group.length
      }))
      .value();
  }

  // Calculate moving average
  calculateMovingAverage(data, window) {
    const result = [];
    for (let i = 0; i < data.length - window + 1; i++) {
      const windowData = data.slice(i, i + window);
      result.push({
        timestamp: data[i + Math.floor(window/2)].timestamp,
        value: _.meanBy(windowData, 'consumption')
      });
    }
    return result;
  }

  // Detect overall trend in consumption
  detectTrend(data) {
    const values = data.map(d => d.consumption);
    const n = values.length;
    
    if (n < 2) return 'insufficient_data';

    // Calculate simple linear regression
    const xMean = (n - 1) / 2;
    const yMean = _.mean(values);
    
    let numerator = 0;
    let denominator = 0;
    
    values.forEach((y, x) => {
      numerator += (x - xMean) * (y - yMean);
      denominator += Math.pow(x - xMean, 2);
    });

    const slope = numerator / denominator;

    return {
      direction: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
      magnitude: Math.abs(slope),
      confidence: this.calculateTrendConfidence(slope, values)
    };
  }

  // Calculate confidence in trend detection
  calculateTrendConfidence(slope, values) {
    const variance = this.calculateVariance(values);
    return Math.min(Math.abs(slope) / Math.sqrt(variance), 1);
  }

  // Analyze variability in consumption
  analyzeVariability(data) {
    const hourlyVariation = this.calculateHourlyVariation(data);
    const overall = this.calculateStatistics(data);

    return {
      hourly: hourlyVariation,
      coefficientOfVariation: overall.standardDeviation / overall.median,
      volatility: this.calculateVolatility(data)
    };
  }

  // Calculate hourly variation
  calculateHourlyVariation(data) {
    const grouped = this.groupByHour(data);
    
    return _.mapValues(grouped, group => ({
      average: group.average,
      variation: Math.sqrt(
        _.sumBy(data, d => Math.pow(d.consumption - group.average, 2)) / data.length
      )
    }));
  }

  // Calculate volatility (rate of change)
  calculateVolatility(data) {
    if (data.length < 2) return 0;

    const changes = [];
    for (let i = 1; i < data.length; i++) {
      const percentChange = (data[i].consumption - data[i-1].consumption) / data[i-1].consumption;
      changes.push(percentChange);
    }

    return {
      average: _.mean(changes),
      maximum: _.max(changes),
      standardDeviation: this.calculateStandardDeviation(changes)
    };
  }

  // Generate a summary of the analysis
  generateSummary(data) {
    const stats = this.calculateStatistics(data);
    const trends = this.analyzeTrends(data);

    return {
      averageConsumption: this.calculateAverage(data),
      totalConsumption: this.calculateTotal(data),
      peakConsumption: stats.max,
      lowestConsumption: stats.min,
      trend: trends.trend.direction,
      variability: trends.variability.coefficientOfVariation,
      reliability: 1 - (stats.standardDeviation / stats.median)
    };
  }
}

export default ConsumptionAnalyzer;