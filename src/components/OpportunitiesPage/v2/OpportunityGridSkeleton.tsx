import React from 'react';
import { motion } from 'framer-motion';

interface OpportunityGridSkeletonProps {
  count?: number;
}

const OpportunityGridSkeleton: React.FC<OpportunityGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-beige/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {/* Image skeleton */}
          <div className="relative h-56 bg-warm-beige/30 animate-pulse">
            {/* Mock overlays */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/50 rounded-full w-24 h-8"></div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/50 rounded-full w-16 h-8"></div>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/50 rounded-full w-20 h-6"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Organization name */}
            <div className="bg-warm-beige/40 rounded h-4 w-32 mb-2 animate-pulse"></div>
            
            {/* Title */}
            <div className="space-y-2 mb-3">
              <div className="bg-warm-beige/40 rounded h-6 w-full animate-pulse"></div>
              <div className="bg-warm-beige/40 rounded h-6 w-3/4 animate-pulse"></div>
            </div>
            
            {/* Key details */}
            <div className="bg-warm-beige/20 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-warm-beige/40 rounded h-4 w-full animate-pulse"></div>
                <div className="bg-warm-beige/40 rounded h-4 w-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="bg-warm-beige/40 rounded h-4 w-full animate-pulse"></div>
              <div className="bg-warm-beige/40 rounded h-4 w-5/6 animate-pulse"></div>
            </div>
            
            {/* Animal tags */}
            <div className="flex gap-2 mb-5">
              <div className="bg-warm-beige/40 rounded-full h-6 w-20 animate-pulse"></div>
              <div className="bg-warm-beige/40 rounded-full h-6 w-24 animate-pulse"></div>
              <div className="bg-warm-beige/40 rounded-full h-6 w-16 animate-pulse"></div>
            </div>
            
            {/* CTA button */}
            <div className="bg-warm-beige/40 rounded-xl h-12 w-full animate-pulse"></div>
            
            {/* Date */}
            <div className="mt-3 flex justify-center">
              <div className="bg-warm-beige/40 rounded h-3 w-24 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OpportunityGridSkeleton;