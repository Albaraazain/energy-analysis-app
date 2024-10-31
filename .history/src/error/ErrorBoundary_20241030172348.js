# File: src/components/error/ErrorBoundary.js

import React, { Component } from 'react';
import { Card } from '../components/ui/card';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to your preferred logging service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 m-4 bg-red-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 mb-4">
              {this.state.error && this.state.error.toString()}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;