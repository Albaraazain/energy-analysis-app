import Papa from 'papaparse';
import { cleanEnergyData } from './data-types';

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.isLoading = false;
    this.error = null;
  }

  // Load CSV data from file
  async loadCsvData(fileName) {
    try {
      this.isLoading = true;
      this.error = null;

      // Check cache first
      if (this.cache.has(fileName)) {
        const cachedData = this.cache.get(fileName);
        // Cache for 5 minutes
        if (Date.now() - this.lastUpdate < 5 * 60 * 1000) {
          return cachedData;
        }
      }

      const response = await window.fs.readFile(fileName, { encoding: 'utf8' });
      
      return new Promise((resolve, reject) => {
        Papa.parse(response, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              const error = new Error('CSV parsing errors detected');
              error.details = results.errors;
              reject(error);
              return;
            }

            const cleanedData = this.processData(results.data);
            this.cache.set(fileName, cleanedData);
            this.lastUpdate = Date.now();
            resolve(cleanedData);
          },
          error: (error) => {
            reject(new Error('Failed to parse CSV: ' + error.message));
          }
        });
      });

    } catch (error) {
      this.error = error;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Process and validate the parsed data
  processData(rawData) {
    try {
      // Clean and validate the data
      const cleanedData = cleanEnergyData(rawData);

      // Sort by timestamp
      cleanedData.sort((a, b) => a.timestamp - b.timestamp);

      // Check for gaps and anomalies
      this.checkDataQuality(cleanedData);

      return cleanedData;
    } catch (error) {
      throw new Error('Data processing failed: ' + error.message);
    }
  }

  // Check for data quality issues
  checkDataQuality(data) {
    if (data.length === 0) {
      throw new Error('No valid data points found');
    }

    // Check for time gaps larger than expected
    const expectedInterval = this.detectTimeInterval(data);
    const gaps = this.findTimeGaps(data, expectedInterval);

    if (gaps.length > 0) {
      console.warn('Time gaps detected in data:', gaps);
    }

    // Check for anomalies in consumption values
    this.detectAnomalies(data);
  }

  // Detect the time interval between readings
  detectTimeInterval(data) {
    if (data.length < 2) return null;

    // Look at first few intervals to determine typical spacing
    const intervals = [];
    for (let i = 1; i < Math.min(data.length, 10); i++) {
      intervals.push(data[i].timestamp - data[i-1].timestamp);
    }

    // Return the median interval
    intervals.sort((a, b) => a - b);
    return intervals[Math.floor(intervals.length / 2)];
  }

  // Find gaps in time series data
  findTimeGaps(data, expectedInterval) {
    const gaps = [];
    
    if (!expectedInterval) return gaps;

    for (let i = 1; i < data.length; i++) {
      const interval = data[i].timestamp - data[i-1].timestamp;
      if (interval > expectedInterval * 2) { // Gap is more than double expected
        gaps.push({
          start: data[i-1].timestamp,
          end: data[i].timestamp,
          duration: interval
        });
      }
    }

    return gaps;
  }

  // Detect anomalies in consumption values
  detectAnomalies(data) {
    // Calculate mean and standard deviation
    const values = data.map(d => d.consumption);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length
    );

    // Flag values more than 3 standard deviations from mean
    const anomalies = data.filter(d => 
      Math.abs(d.consumption - mean) > 3 * stdDev
    );

    if (anomalies.length > 0) {
      console.warn('Anomalies detected:', anomalies);
    }
  }

  // Clear the cache
  clearCache() {
    this.cache.clear();
    this.lastUpdate = null;
  }
}

export default new DataLoader();