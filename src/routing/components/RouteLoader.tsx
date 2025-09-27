// src/routing/components/RouteLoader.tsx
// IMPLEMENTATION TARGET: Optimized loading states per route type

import React from 'react';
import { motion } from 'framer-motion';

interface RouteLoaderProps {
  route: {
    id: string;
    component?: string;
  };
}

export const RouteLoader: React.FC<RouteLoaderProps> = ({ route }) => {
  // Different loading states for different route types
  const getLoadingContent = () => {
    if (route.component?.includes('Country')) {
      return {
        title: 'Loading country information...',
        description: 'Preparing wildlife volunteer programs',
        skeleton: <CountryPageSkeleton />
      };
    }

    if (route.component?.includes('Animal')) {
      return {
        title: 'Loading animal conservation programs...',
        description: 'Finding volunteer opportunities',
        skeleton: <AnimalPageSkeleton />
      };
    }

    if (route.component?.includes('Combined')) {
      return {
        title: 'Loading specialized programs...',
        description: 'Finding the perfect match',
        skeleton: <CombinedPageSkeleton />
      };
    }

    if (route.component?.includes('Opportunities')) {
      return {
        title: 'Loading volunteer opportunities...',
        description: 'Discovering conservation programs worldwide',
        skeleton: <OpportunitiesPageSkeleton />
      };
    }

    // Default loading state
    return {
      title: 'Loading...',
      description: 'Preparing your conservation journey',
      skeleton: <DefaultSkeleton />
    };
  };

  const loadingContent = getLoadingContent();

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header skeleton */}
      <div className="bg-white border-b border-warm-beige/40">
        <div className="container mx-auto px-6 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-warm-beige/40 rounded w-48 mb-2"></div>
            <div className="h-4 bg-warm-beige/30 rounded w-64"></div>
          </div>
        </div>
      </div>

      {/* Main loading content */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 border-3 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-forest mb-2">{loadingContent.title}</h2>
          <p className="text-forest/70">{loadingContent.description}</p>
        </motion.div>

        {/* Route-specific skeleton */}
        {loadingContent.skeleton}
      </div>
    </div>
  );
};

// Skeleton components for different page types
const CountryPageSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Hero skeleton */}
    <div className="animate-pulse">
      <div className="h-64 bg-warm-beige/30 rounded-2xl mb-6"></div>
      <div className="h-8 bg-warm-beige/40 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-full mb-2"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-2/3"></div>
    </div>

    {/* Programs grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-warm-beige/30 rounded-2xl h-80"></div>
        </div>
      ))}
    </div>
  </div>
);

const AnimalPageSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Animal info skeleton */}
    <div className="animate-pulse">
      <div className="h-48 bg-warm-beige/30 rounded-2xl mb-6"></div>
      <div className="h-6 bg-warm-beige/40 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-full mb-2"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-3/4"></div>
    </div>

    {/* Conservation programs skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-warm-beige/30 rounded-xl h-64"></div>
        </div>
      ))}
    </div>
  </div>
);

const CombinedPageSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Combined header skeleton */}
    <div className="animate-pulse">
      <div className="h-6 bg-warm-beige/40 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-warm-beige/30 rounded w-1/2"></div>
    </div>

    {/* Specialized programs skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-warm-beige/30 rounded-xl h-72"></div>
        </div>
      ))}
    </div>
  </div>
);

const OpportunitiesPageSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Filters skeleton */}
    <div className="animate-pulse">
      <div className="bg-warm-beige/20 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-warm-beige/40 rounded"></div>
          ))}
        </div>
      </div>
    </div>

    {/* Opportunities grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-warm-beige/30 rounded-2xl h-80"></div>
        </div>
      ))}
    </div>
  </div>
);

const DefaultSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 bg-warm-beige/40 rounded w-1/4"></div>
    <div className="h-4 bg-warm-beige/30 rounded w-full"></div>
    <div className="h-4 bg-warm-beige/30 rounded w-3/4"></div>
    <div className="h-4 bg-warm-beige/30 rounded w-1/2"></div>
  </div>
);

export default RouteLoader;