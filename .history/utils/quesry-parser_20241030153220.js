# File: src/utils/queryParser.js

import { getDateRange, parseFlexibleDate } from './dateUtils';

// Query types for different kinds of analysis
const QUERY_TYPES = {
  USAGE_INQUIRY: 'usage_inquiry',      // "How much energy did I use..."
  COMPARISON: 'comparison',            // "Was my usage higher than..."
  PATTERN: 'pattern',                  // "What's my typical usage..."
  ANOMALY: 'anomaly',                  // "Any unusual consumption..."
  UNKNOWN: 'unknown'
};

class QueryParser {
  constructor() {
    // Keywords for different types of queries
    this.keywords = {
      usage: ['use', 'used', 'usage', 'consume', 'consumed', 'consumption'],
      comparison: ['compare', 'compared', 'higher', 'lower', 'more', 'less', 'than'],
      pattern: ['typical', 'usually', 'normal', 'average', 'pattern', 'regularly'],
      anomaly: ['unusual', 'abnormal', 'strange', 'unexpected', 'spike', 'different']
    };

    // Common time expressions
    this.timeExpressions = {
      relative: [
        'yesterday',
        'last night',
        'this morning',
        'last week',
        'past week',
        'last month',
        'past month',
        'today'
      ],
      specific: [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december',
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
      ]
    };
  }

  parseQuery(query) {
    const lowercaseQuery = query.toLowerCase();
    
    return {
      type: this.detectQueryType(lowercaseQuery),
      timeRange: this.extractTimeRange(lowercaseQuery),
      keywords: this.extractKeywords(lowercaseQuery),
      confidence: this.calculateConfidence(lowercaseQuery)
    };
  }

  detectQueryType(query) {
    // Count keyword matches for each type
    const matches = Object.entries(this.keywords).reduce((acc, [type, keywords]) => {
      acc[type] = keywords.filter(keyword => query.includes(keyword)).length;
      return acc;
    }, {});

    // Find the type with the most matches
    const maxMatches = Math.max(...Object.values(matches));
    const queryType = Object.entries(matches).find(([, count]) => count === maxMatches)?.[0];

    switch (queryType) {
      case 'usage':
        return QUERY_TYPES.USAGE_INQUIRY;
      case 'comparison':
        return QUERY_TYPES.COMPARISON;
      case 'pattern':
        return QUERY_TYPES.PATTERN;
      case 'anomaly':
        return QUERY_TYPES.ANOMALY;
      default:
        return QUERY_TYPES.UNKNOWN;
    }
  }

  extractTimeRange(query) {
    // Check for relative time expressions first
    for (const expr of this.timeExpressions.relative) {
      if (query.includes(expr)) {
        switch (expr) {
          case 'yesterday':
            return getDateRange('yesterday');
          case 'last week':
          case 'past week':
            return getDateRange('lastWeek');
          case 'last month':
          case 'past month':
            return getDateRange('lastMonth');
          case 'today':
            return getDateRange('today');
          // Add more cases as needed
        }
      }
    }

    // Look for date patterns (e.g., "January 5th", "last Monday")
    const dateMatch = this.findDatePattern(query);
    if (dateMatch) {
      const date = parseFlexibleDate(dateMatch);
      if (date) {
        return {
          start: new Date(date.setHours(0, 0, 0, 0)),
          end: new Date(date.setHours(23, 59, 59, 999))
        };
      }
    }

    // Default to recent period if no time specified
    return getDateRange('lastWeek');
  }

  findDatePattern(query) {
    // Look for month names
    const monthMatch = this.timeExpressions.specific
      .filter(month => query.includes(month))
      .join(' ');
    
    if (monthMatch) {
      // Look for nearby numbers (e.g., "january 5th")
      const datePattern = new RegExp(`${monthMatch}\\s+(\\d+)(?:st|nd|rd|th)?`, 'i');
      const match = query.match(datePattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  extractKeywords(query) {
    // Extract all matching keywords
    const matches = new Set();
    
    Object.values(this.keywords).flat().forEach(keyword => {
      if (query.includes(keyword)) {
        matches.add(keyword);
      }
    });

    return Array.from(matches);
  }

  calculateConfidence(query) {
    // Simple confidence calculation based on keyword matches and time expression clarity
    let confidence = 0;

    // Add points for keyword matches
    const keywordMatches = this.extractKeywords(query).length;
    confidence += keywordMatches * 0.2; // 20% per keyword match

    // Add points for time expression clarity
    const hasTimeExpression = this.timeExpressions.relative
      .concat(this.timeExpressions.specific)
      .some(expr => query.includes(expr));
    
    if (hasTimeExpression) {
      confidence += 0.3; // 30% for clear time expression
    }

    // Cap at 1.0
    return Math.min(confidence, 1);
  }
}

export {
  QueryParser,
  QUERY_TYPES
};