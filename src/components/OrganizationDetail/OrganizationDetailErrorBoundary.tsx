// Error Boundary for Organization Detail System
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  tabName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

export class OrganizationDetailErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('OrganizationDetail Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full max-w-none space-y-6 lg:space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-warm-beige/40 p-8">
            <div className="text-center max-w-2xl mx-auto">
              {/* Error Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              {/* Error Message */}
              <h3 className="text-2xl font-semibold text-deep-forest mb-4">
                {this.props.tabName ? `${this.props.tabName} Tab Error` : 'Content Error'}
              </h3>

              <p className="text-lg text-forest/80 leading-relaxed mb-6">
                We encountered an issue loading this content. This might be due to a temporary
                connection problem or missing data.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-red-50 p-4 rounded-lg border border-red-200">
                  <summary className="cursor-pointer font-medium text-red-800 mb-2">
                    Technical Details (Development)
                  </summary>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-x-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo}
                  </pre>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/opportunities'}
                  className="inline-flex items-center gap-2 bg-white hover:bg-warm-beige/10 text-rich-earth border-2 border-rich-earth px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  Browse Opportunities
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-forest/60 mt-6">
                If this problem persists, please try refreshing the page or contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for individual tabs
interface TabErrorBoundaryProps {
  children: ReactNode;
  tabName: string;
}

export const TabErrorBoundary: React.FC<TabErrorBoundaryProps> = ({ children, tabName }) => {
  return (
    <OrganizationDetailErrorBoundary tabName={tabName}>
      {children}
    </OrganizationDetailErrorBoundary>
  );
};

export default OrganizationDetailErrorBoundary;