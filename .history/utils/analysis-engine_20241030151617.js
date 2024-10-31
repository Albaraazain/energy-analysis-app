// utils/analysis-engine.js
import _ from 'lodash';
import { parseTimestamp, formatDate } from './date-utils';

class EnergyAnalysisEngine {
  constructor(data) {
    this.data = data;
    this.baselineCache = new Map(); // Cache for baseline calculations
  }

  // Get consumption for a specific time range
  getConsumptionInRange(startTime, endTime) {
    return this.data.filter(reading => {
      const timestamp = parseTimestamp(reading.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  }

  // Calculate baseline consumption (typical usage pattern)
  calculateBaseline(timeRange) {
    const cacheKey = `${timeRange.start}-${timeRange.end}`;
    
    if (this.baselineCache.has(cacheKey)) {
      return this.baselineCache.get(cacheKey);
    }

    // Group by hour of day to find typical patterns
    const hourlyAverages = _.chain(this.data)
      .groupBy(reading => {
        const date = parseTimestamp(reading.timestamp);
        return date.getHours();
      })
      .mapValues(readings => {
        const sum = _.sumBy(readings, 'consumption');
        return sum / readings.length;
      })
      .value();

    this.baselineCache.set(cacheKey, hourlyAverages);
    return hourlyAverages;
  }

  // Analyze consumption during an event
  analyzeEvent(eventStart, eventEnd) {
    const eventData = this.getConsumptionInRange(eventStart, eventEnd);
    const eventTotal = _.sumBy(eventData, 'consumption');
    
    // Get baseline for comparison
    const baseline = this.calculateBaseline({ start: eventStart, end: eventEnd });
    const eventHours = Math.ceil((eventEnd - eventStart) / (1000 * 60 * 60));
    
    let baselineTotal = 0;
    for (let hour = eventStart.getHours(); hour < eventStart.getHours() + eventHours; hour++) {
      baselineTotal += baseline[hour % 24] || 0;
    }

    return {
      eventConsumption: eventTotal,
      baselineConsumption: baselineTotal,
      difference: eventTotal - baselineTotal,
      percentageIncrease: ((eventTotal - baselineTotal) / baselineTotal) * 100,
      hourlyBreakdown: eventData
    };
  }

  // Find significant consumption patterns
  findPatterns() {
    const dailyConsumption = _.chain(this.data)
      .groupBy(reading => {
        const date = parseTimestamp(reading.timestamp);
        return date.toISOString().split('T')[0];
      })
      .mapValues(readings => ({
        total: _.sumBy(readings, 'consumption'),
        average: _.meanBy(readings, 'consumption'),
        max: _.maxBy(readings, 'consumption').consumption,
        events: readings.filter(r => r.event).map(r => ({
          time: r.timestamp,
          event: r.event
        }))
      }))
      .value();

    return {
      dailyPatterns: dailyConsumption,
      averageDaily: _.meanBy(Object.values(dailyConsumption), 'total'),
      peaks: this.findPeakUsagePeriods()
    };
  }

  // Identify peak usage periods
  findPeakUsagePeriods() {
    const baseline = this.calculateBaseline({
      start: parseTimestamp(this.data[0].timestamp),
      end: parseTimestamp(this.data[this.data.length - 1].timestamp)
    });

    return this.data.filter(reading => {
      const hour = parseTimestamp(reading.timestamp).getHours();
      const baselineForHour = baseline[hour] || 0;
      // Flag if consumption is 50% above baseline
      return reading.consumption > baselineForHour * 1.5;
    });
  }

  // Generate insights about energy usage
  generateInsights() {
    const patterns = this.findPatterns();
    const peaks = patterns.peaks;
    
    const insights = [
      {
        type: 'average',
        message: `Average daily consumption: ${patterns.averageDaily.toFixed(2)} kWh`
      }
    ];

    if (peaks.length > 0) {
      insights.push({
        type: 'peaks',
        message: `Found ${peaks.length} periods of unusually high consumption`
      });
    }

    // Add insights about events
    const events = this.data.filter(r => r.event);
    if (events.length > 0) {
      insights.push({
        type: 'events',
        message: `Found ${events.length} recorded events that may have affected consumption`
      });
    }

    return insights;
  }
}

export default EnergyAnalysisEngine;