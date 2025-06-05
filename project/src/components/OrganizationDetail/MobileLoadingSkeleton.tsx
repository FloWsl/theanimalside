// src/components/OrganizationDetail/MobileLoadingSkeleton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MobileLoadingSkeletonProps {
  type?: 'card' | 'gallery' | 'text' | 'form' | 'tab-content' | 'essential-info';
  count?: number;
  className?: string;
}

const MobileLoadingSkeleton: React.FC<MobileLoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  
  const shimmerAnimation = {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  const SkeletonElement: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {/* Shimmer effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={shimmerAnimation}
        style={{ transform: 'translateX(-100%) skewX(-12deg)' }}
      />
    </div>
  );

  const renderCardSkeleton = () => (
    <SkeletonElement>
      <div className="bg-gradient-to-br from-warm-beige/30 to-soft-cream/50 rounded-2xl p-6 space-y-4 border border-warm-beige/40">
        {/* Header skeleton */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-warm-beige/60 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-warm-beige/60 rounded-lg w-3/4" />
            <div className="h-3 bg-warm-beige/40 rounded-lg w-1/2" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-3 bg-warm-beige/60 rounded-lg w-full" />
          <div className="h-3 bg-warm-beige/60 rounded-lg w-4/5" />
          <div className="h-3 bg-warm-beige/40 rounded-lg w-2/3" />
        </div>
        
        {/* Action skeleton */}
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-warm-beige/60 rounded-lg w-20" />
          <div className="h-8 bg-sage-green/20 rounded-lg w-24" />
        </div>
      </div>
    </SkeletonElement>
  );

  const renderGallerySkeleton = () => (
    <SkeletonElement>
      <div className="bg-gradient-to-br from-warm-beige/30 to-soft-cream/50 rounded-xl overflow-hidden border border-warm-beige/40">
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-warm-beige/60 flex items-center justify-center">
          <div className="w-12 h-12 bg-warm-beige/80 rounded-lg" />
        </div>
        
        {/* Caption skeleton */}
        <div className="p-4 space-y-2">
          <div className="h-4 bg-warm-beige/60 rounded-lg w-4/5" />
          <div className="h-3 bg-warm-beige/40 rounded-lg w-2/5" />
        </div>
      </div>
    </SkeletonElement>
  );

  const renderTextSkeleton = () => (
    <SkeletonElement>
      <div className="space-y-3">
        <div className="h-6 bg-warm-beige/60 rounded-lg w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-warm-beige/60 rounded-lg w-full" />
          <div className="h-4 bg-warm-beige/60 rounded-lg w-5/6" />
          <div className="h-4 bg-warm-beige/40 rounded-lg w-3/4" />
        </div>
      </div>
    </SkeletonElement>
  );

  const renderFormSkeleton = () => (
    <SkeletonElement>
      <div className="bg-gradient-to-br from-warm-beige/20 to-soft-cream/40 rounded-2xl p-6 space-y-6 border border-warm-beige/30">
        {/* Form header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-warm-beige/60 rounded-full mx-auto" />
          <div className="h-6 bg-warm-beige/60 rounded-lg w-1/2 mx-auto" />
          <div className="h-4 bg-warm-beige/40 rounded-lg w-3/4 mx-auto" />
        </div>
        
        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-warm-beige/60 rounded-lg w-1/4" />
            <div className="h-12 bg-warm-beige/40 rounded-xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-warm-beige/60 rounded-lg w-1/3" />
            <div className="h-12 bg-warm-beige/40 rounded-xl w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-warm-beige/60 rounded-lg w-1/5" />
            <div className="h-12 bg-warm-beige/40 rounded-xl w-full" />
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex gap-3 pt-4">
          <div className="h-12 bg-warm-beige/40 rounded-xl w-1/3" />
          <div className="h-12 bg-sage-green/20 rounded-xl flex-1" />
        </div>
      </div>
    </SkeletonElement>
  );

  const renderTabContentSkeleton = () => (
    <SkeletonElement>
      <div className="space-y-8">
        {/* Hero section skeleton */}
        <div className="bg-gradient-to-br from-warm-beige/20 to-soft-cream/40 rounded-3xl p-8 text-center space-y-4 border border-warm-beige/30">
          <div className="w-16 h-16 bg-warm-beige/60 rounded-2xl mx-auto" />
          <div className="h-8 bg-warm-beige/60 rounded-lg w-1/2 mx-auto" />
          <div className="h-4 bg-warm-beige/40 rounded-lg w-3/4 mx-auto" />
        </div>
        
        {/* Content sections skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-warm-beige/20 to-soft-cream/40 rounded-2xl p-6 space-y-4 border border-warm-beige/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warm-beige/60 rounded-xl" />
                <div className="h-5 bg-warm-beige/60 rounded-lg flex-1" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-warm-beige/40 rounded-lg w-full" />
                <div className="h-3 bg-warm-beige/40 rounded-lg w-4/5" />
                <div className="h-3 bg-warm-beige/40 rounded-lg w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonElement>
  );

  const renderEssentialInfoSkeleton = () => (
    <SkeletonElement>
      <div className="bg-gradient-to-br from-warm-beige/20 to-soft-cream/40 rounded-2xl p-6 space-y-6 border border-warm-beige/30 sticky top-4">
        {/* Title skeleton */}
        <div className="text-center space-y-3">
          <div className="h-6 bg-warm-beige/60 rounded-lg w-2/3 mx-auto" />
          <div className="h-4 bg-warm-beige/40 rounded-lg w-1/2 mx-auto" />
        </div>
        
        {/* Info cards skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-warm-beige/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-warm-beige/60 rounded-lg w-1/3" />
                <div className="h-5 bg-sage-green/30 rounded-lg w-1/4" />
              </div>
              <div className="h-3 bg-warm-beige/40 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
        
        {/* CTA skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-rich-earth/20 rounded-xl w-full" />
          <div className="h-10 bg-sage-green/20 rounded-xl w-full" />
        </div>
      </div>
    </SkeletonElement>
  );

  const renderSkeletonByType = () => {
    switch (type) {
      case 'gallery':
        return renderGallerySkeleton();
      case 'text':
        return renderTextSkeleton();
      case 'form':
        return renderFormSkeleton();
      case 'tab-content':
        return renderTabContentSkeleton();
      case 'essential-info':
        return renderEssentialInfoSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div className="animate-pulse-earth">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={count > 1 ? 'mb-6' : ''}
        >
          {renderSkeletonByType()}
        </motion.div>
      ))}
    </div>
  );
};

// Specific skeleton components for common use cases
export const TabContentSkeleton: React.FC = () => (
  <MobileLoadingSkeleton type="tab-content" />
);

export const GallerySkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <MobileLoadingSkeleton type="gallery" count={count} />
  </div>
);

export const FormSkeleton: React.FC = () => (
  <MobileLoadingSkeleton type="form" />
);

export const EssentialInfoSkeleton: React.FC = () => (
  <MobileLoadingSkeleton type="essential-info" />
);

export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <MobileLoadingSkeleton type="text" count={lines} />
);

export default MobileLoadingSkeleton;