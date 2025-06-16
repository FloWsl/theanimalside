// 🔄 Loading States and Error Handling Components
// Comprehensive loading states for database integration

import React from 'react';
import { AlertCircle, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';

// ==================== LOADING COMPONENTS ====================

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'hero' | 'gallery' | 'sidebar';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-nature border border-warm-beige/60">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-nature border border-warm-beige/60">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <div className="animate-pulse flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'gallery':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        );

      case 'sidebar':
        return (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-warm-beige/60">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {count === 1 ? renderSkeleton() : (
        <div className="space-y-4">
          {[...Array(count)].map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline loading spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={`animate-spin text-sage-green ${sizeClasses[size]} ${className}`} />
  );
};

// Tab loading state
export const TabLoading: React.FC<{ tabName: string }> = ({ tabName }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <LoadingSpinner size="lg" className="mb-4" />
    <h3 className="text-lg font-semibold text-forest mb-2">Loading {tabName}</h3>
    <p className="text-sm text-forest/70 text-center max-w-md">
      We're fetching the latest information for you. This should only take a moment.
    </p>
  </div>
);

// ==================== ERROR COMPONENTS ====================

interface ErrorDisplayProps {
  error: Error;
  retry?: () => void;
  context?: string;
  variant?: 'card' | 'inline' | 'page';
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  retry, 
  context, 
  variant = 'card',
  className = '' 
}) => {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  
  const getErrorContent = () => {
    switch (variant) {
      case 'page':
        return (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
            </h2>
            <p className="text-red-700 mb-6 max-w-md mx-auto">
              {isNetworkError 
                ? 'Please check your internet connection and try again.'
                : `Unable to load ${context || 'this content'}. ${error.message}`
              }
            </p>
            {retry && (
              <button 
                onClick={retry}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        );

      case 'inline':
        return (
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-800 font-medium">
                Failed to load {context || 'data'}
              </p>
              <p className="text-xs text-red-600 mt-1">{error.message}</p>
            </div>
            {retry && (
              <button 
                onClick={retry}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        );

      case 'card':
      default:
        return (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            {isNetworkError ? (
              <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {isNetworkError ? 'Connection Problem' : `Unable to Load ${context || 'Information'}`}
            </h3>
            <p className="text-red-700 mb-4 text-sm">
              {isNetworkError 
                ? 'Please check your internet connection and try again.'
                : error.message
              }
            </p>
            {retry && (
              <button 
                onClick={retry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {getErrorContent()}
    </div>
  );
};

// Tab-specific error
export const TabError: React.FC<{ error: Error; retry: () => void; tabName: string }> = ({ 
  error, 
  retry, 
  tabName 
}) => (
  <ErrorDisplay 
    error={error} 
    retry={retry} 
    context={`${tabName} data`} 
    variant="page" 
  />
);

// ==================== EMPTY STATES ====================

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action, 
  icon,
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && (
      <div className="text-gray-400 mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    {action && (
      <button 
        onClick={action.onClick}
        className="bg-sage-green hover:bg-sage-green/90 text-white px-6 py-2 rounded-lg transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

// ==================== NETWORK STATUS ====================

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-50">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">
          You're offline. Some features may not work properly.
        </span>
      </div>
    </div>
  );
};

// ==================== TAB WRAPPER WITH STATES ====================

interface TabWrapperProps {
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
  tabName: string;
  children: React.ReactNode;
  loadingVariant?: 'card' | 'list' | 'hero' | 'gallery' | 'sidebar';
  className?: string;
}

export const TabWrapper: React.FC<TabWrapperProps> = ({
  isLoading,
  error,
  retry,
  tabName,
  children,
  loadingVariant = 'card',
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSkeleton variant={loadingVariant} count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <TabError error={error} retry={retry} tabName={tabName} />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// ==================== PROGRESSIVE LOADING ====================

interface ProgressiveLoaderProps {
  isLoading: boolean;
  hasData: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const ProgressiveLoader: React.FC<ProgressiveLoaderProps> = ({
  isLoading,
  hasData,
  children,
  fallback,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && !hasData && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          {fallback || <LoadingSpinner size="lg" />}
        </div>
      )}
      {isLoading && hasData && (
        <div className="absolute top-2 right-2">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
};

// ==================== RETRY BUTTON ====================

interface RetryButtonProps {
  onRetry: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center gap-2 rounded-lg transition-colors font-medium disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-sage-green hover:bg-sage-green/90 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    ghost: 'hover:bg-gray-100 text-gray-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onRetry}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {isLoading ? 'Retrying...' : 'Try Again'}
    </button>
  );
};