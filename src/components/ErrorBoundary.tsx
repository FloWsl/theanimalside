// Error Boundary Component for React Error Handling
// PATTERN: Graceful error recovery

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-soft-cream">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-forest mb-4">
              Something went wrong
            </h2>
            <p className="text-forest/70 mb-6">
              We're working to fix this issue. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-sage-green text-white px-6 py-2 rounded hover:bg-forest transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;