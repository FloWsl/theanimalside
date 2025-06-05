// src/components/OrganizationDetail/ResponsiveImage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  sizes?: string;
  quality?: number;
}

interface ImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  priority = false,
  onLoad,
  onError,
  placeholder,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 80
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate responsive image URLs
  const generateImageSizes = (originalSrc: string): ImageSizes => {
    // Check if the source is from Unsplash (which supports URL parameters)
    if (originalSrc.includes('unsplash.com')) {
      const baseUrl = originalSrc.split('?')[0];
      return {
        mobile: `${baseUrl}?w=400&h=300&fit=crop&q=${quality}&auto=format`,
        tablet: `${baseUrl}?w=600&h=450&fit=crop&q=${quality}&auto=format`,
        desktop: `${baseUrl}?w=800&h=600&fit=crop&q=${quality}&auto=format`
      };
    }
    
    // For other sources, return the original URL
    return {
      mobile: originalSrc,
      tablet: originalSrc,
      desktop: originalSrc
    };
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Progressive image loading
  useEffect(() => {
    if (!isInView || error) return;

    const imageSizes = generateImageSizes(src);
    let loadedSrc = '';

    // Determine which image size to load based on screen width
    const getImageSrc = () => {
      if (typeof window === 'undefined') return imageSizes.desktop;
      
      const width = window.innerWidth;
      if (width < 640) return imageSizes.mobile;
      if (width < 1024) return imageSizes.tablet;
      return imageSizes.desktop;
    };

    const loadImage = (imageSrc: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedSrc = imageSrc;
          resolve();
        };
        img.onerror = reject;
        img.src = imageSrc;
      });
    };

    // Load appropriate image size
    const targetSrc = getImageSrc();
    
    loadImage(targetSrc)
      .then(() => {
        setCurrentSrc(loadedSrc);
        setIsLoaded(true);
        onLoad?.();
      })
      .catch(() => {
        setError(true);
        onError?.();
      });

  }, [isInView, src, quality, onLoad, onError, error]);

  // Get aspect ratio classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '4/3':
        return 'aspect-[4/3]';
      case '16/9':
        return 'aspect-video';
      case 'auto':
      default:
        return '';
    }
  };

  // Placeholder component
  const renderPlaceholder = () => (
    <div className={`bg-gradient-to-br from-warm-beige/40 to-soft-cream/60 flex items-center justify-center ${getAspectRatioClass()}`}>
      <div className="text-center space-y-2">
        <div className="w-8 h-8 bg-warm-beige/60 rounded-lg mx-auto" />
        <div className="w-16 h-2 bg-warm-beige/40 rounded-full" />
      </div>
    </div>
  );

  // Error component
  const renderError = () => (
    <div className={`bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center ${getAspectRatioClass()} border border-red-200`}>
      <div className="text-center space-y-2">
        <div className="w-8 h-8 bg-red-300 rounded-lg mx-auto" />
        <p className="text-xs text-red-600">Failed to load image</p>
      </div>
    </div>
  );

  // Loading shimmer effect
  const renderLoadingShimmer = () => (
    <div className={`relative overflow-hidden bg-gradient-to-br from-warm-beige/40 to-soft-cream/60 ${getAspectRatioClass()}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{ transform: 'translateX(-100%) skewX(-12deg)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 bg-warm-beige/60 rounded-lg mx-auto animate-pulse" />
          <div className="w-16 h-2 bg-warm-beige/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      {error ? (
        renderError()
      ) : !isInView ? (
        placeholder ? (
          <img 
            src={placeholder} 
            alt={alt}
            className={`w-full h-full object-cover ${getAspectRatioClass()}`}
          />
        ) : (
          renderPlaceholder()
        )
      ) : !isLoaded ? (
        renderLoadingShimmer()
      ) : (
        <motion.img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${getAspectRatioClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
          // Preload hint for browsers
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
        />
      )}
      
      {/* Progressive loading indicator */}
      {isInView && !isLoaded && !error && (
        <div className="absolute bottom-2 left-2">
          <div className="w-6 h-6 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <motion.div
              className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Higher-order component for image optimization
export const withImageOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <div style={{ 
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)'
    }}>
      <Component {...props} ref={ref} />
    </div>
  ));
};

// Utility function to preload critical images
export const preloadImage = (src: string, priority: 'high' | 'low' = 'low') => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  document.head.appendChild(link);
};

// Utility function to create optimized srcSet
export const createSrcSet = (baseUrl: string, quality: number = 80): string => {
  if (!baseUrl.includes('unsplash.com')) return baseUrl;
  
  const base = baseUrl.split('?')[0];
  return [
    `${base}?w=400&h=300&fit=crop&q=${quality}&auto=format 400w`,
    `${base}?w=600&h=450&fit=crop&q=${quality}&auto=format 600w`,
    `${base}?w=800&h=600&fit=crop&q=${quality}&auto=format 800w`,
    `${base}?w=1200&h=900&fit=crop&q=${quality}&auto=format 1200w`
  ].join(', ');
};

export default ResponsiveImage;