import React from 'react';

interface NavigationSkeletonProps {
  variant: 'sidebar' | 'inline' | 'footer';
  count?: number;
}

const NavigationSkeleton: React.FC<NavigationSkeletonProps> = ({ 
  variant,
  count = variant === 'sidebar' ? 3 : 4
}) => {
  const SkeletonCard: React.FC<{ variant: string }> = ({ variant }) => {
    if (variant === 'sidebar') {
      return (
        <div className="bg-white border border-warm-beige/30 shadow-sm rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-warm-beige/40 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-3 bg-warm-beige/30 rounded w-20 animate-pulse"></div>
            </div>
            <div className="w-5 h-5 bg-warm-beige/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-warm-beige/40 shadow-sm p-4 min-w-[130px] max-w-[150px] flex-shrink-0">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 bg-warm-beige/40 rounded animate-pulse"></div>
          <div className="h-3 bg-warm-beige/30 rounded w-16 animate-pulse"></div>
          <div className="w-6 h-6 bg-warm-beige/30 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  };

  if (variant === 'inline') {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-soft-cream to-warm-beige/30 rounded-xl p-6 mb-6">
          <div className="mb-4 animate-pulse">
            <div className="h-5 bg-warm-beige/40 rounded w-48 mb-2"></div>
            <div className="h-4 bg-warm-beige/30 rounded w-64"></div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
            {Array.from({ length: count }).map((_, i) => (
              <SkeletonCard key={i} variant={variant} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const containerClass = variant === 'footer' ? 'flex gap-3 overflow-x-auto pb-2' : 'space-y-2';

  return (
    <div className="space-y-4">
      <div className={containerClass}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
};

export default NavigationSkeleton;