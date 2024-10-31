# File: src/utils/responseGenerator.js

class ResponseGenerator {
  constructor() {
    this.templates = {
      usage: {
        high: "Your energy consumption during this period was relatively high at {value} kWh, which is {percentage}% above your typical usage.",
        low: "Your energy consumption was lower than usual at {value} kWh, {percentage}% below your typical usage.",
        normal: "Your energy consumption of {value} kWh was within normal range, just {percentage}% {direction} your typical usage."
      },
      comparison: {
        increase: "There was an increase of {percentage}% compared to {compareWith}.",
        decrease: "There was a decrease of {percentage}% compared to {compareWith}.",
        noChange: "Usage remained stable compared to {compareWith}, with only a {percentage}% difference."
      },
      pattern: {
        peak: "Peak usage typically occurs between {startTime} and {endTime}, averaging {value} kWh.",
        lowest: "Lowest consumption is usually between {startTime} and {endTime}, averaging {value} kWh.",
        consistent: "Usage is most consistent during {timeRange}, varying by only {variation}%."
      }
    };
  }

  generateResponse(analysis, queryType) {
    const parts = [];
    
    // Main response based on analysis type
    parts.push(this.generateMainResponse(analysis, queryType));
    
    // Add insights if available
    if (analysis.insights?.length > 0) {
      parts.push(this.generateInsights(analysis.insights));
    }
    
    // Add recommendations if applicable
    if (analysis.recommendations?.length > 0) {
      parts.push(this.generateRecommendations(analysis.recommendations));
    }

    return parts.filter(Boolean).join(' ');
  }

  generateMainResponse(analysis, queryType) {
    const { summary } = analysis;
    
    switch (queryType) {
      case 'usage_inquiry':
        return this.generateUsageResponse(summary);
      case 'comparison':
        return this.generateComparisonResponse(summary);
      case 'pattern':
        return this.generatePatternResponse(summary);
      default:
        return this.generateGeneralResponse(summary);
    }
  }

  formatValue(value, type = 'number') {
    switch (type) {
      case 'percentage':
        return Math.abs(Number(value)).toFixed(1) + '%';
      case 'energy':
        return Number(value).toFixed(2) + ' kWh';
      case 'time':
        return new Date(value).toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit' 
        });
      default:
        return Number(value).toFixed(2);
    }
  }

  generateUsageResponse(summary) {
    const percentage = ((summary.actual - summary.expected) / summary.expected) * 100;
    const template = this.templates.usage[
      percentage > 10 ? 'high' : 
      percentage < -10 ? 'low' : 
      'normal'
    ];

    return template.replace(
      {
        '{value}': this.formatValue(summary.actual, 'energy'),
        '{percentage}': this.formatValue(Math.abs(percentage), 'percentage'),
        '{direction}': percentage > 0 ? 'above' : 'below'
      }
    );
  }

  generateComparisonResponse(summary) {
    const percentage = summary.percentageChange;
    const template = this.templates.comparison[
      percentage > 5 ? 'increase' :
      percentage < -5 ? 'decrease' :
      'noChange'
    ];

    return template.replace(
      {
        '{percentage}': this.formatValue(Math.abs(percentage), 'percentage'),
        '{compareWith}': summary.comparisonPeriod
      }
    );
  }

  generatePatternResponse(summary) {
    const { patterns } = summary;
    const responses = [];

    if (patterns.peak) {
      responses.push(this.templates.pattern.peak.replace({
        '{startTime}': this.formatValue(patterns.peak.start, 'time'),
        '{endTime}': this.formatValue(patterns.peak.end, 'time'),
        '{value}': this.formatValue(patterns.peak.average, 'energy')
      }));
    }

    if (patterns.lowest) {
      responses.push(this.templates.pattern.lowest.replace({
        '{startTime}': this.formatValue(patterns.lowest.start, 'time'),
        '{endTime}': this.formatValue(patterns.lowest.end, 'time'),
        '{value}': this.formatValue(patterns.lowest.average, 'energy')
      }));
    }

    return responses.join(' ');
  }

  generateGeneralResponse(summary) {
    return `Your total energy consumption was ${this.formatValue(summary.total, 'energy')}, 
      with an average of ${this.formatValue(summary.average, 'energy')} per hour.`;
  }

  generateInsights(insights) {
    if (!insights?.length) return '';

    // Sort insights by confidence/importance
    const sortedInsights = [...insights].sort((a, b) => b.confidence - a.confidence);

    // Take top 3 most relevant insights
    return sortedInsights.slice(0, 3)
      .map(insight => this.formatInsight(insight))
      .join(' ');
  }

  formatInsight(insight) {
    switch (insight.type) {
      case 'trend':
        return `There's a ${insight.confidence > 0.8 ? 'clear' : 'noticeable'} ${insight.direction} trend in your consumption.`;
      case 'anomaly':
        return `Unusual consumption was detected ${this.formatValue(insight.timestamp, 'time')}.`;
      case 'pattern':
        return insight.description;
      default:
        return insight.description;
    }
  }

  generateRecommendations(recommendations) {
    if (!recommendations?.length) return '';

    return 'Recommendations: ' + recommendations
      .map(rec => `${rec.description}${rec.savingPotential ? ` (potential saving: ${this.formatValue(rec.savingPotential, 'percentage')})` : ''}`)
      .join(' ');
  }

  // Helper method to replace multiple placeholders in a template
  replace(template, replacements) {
    return Object.entries(replacements).reduce(
      (str, [key, value]) => str.replace(key, value),
      template
    );
  }
}

export default new ResponseGenerator();