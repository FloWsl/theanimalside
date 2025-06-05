// src/components/OrganizationDetail/PerformanceOptimizer.tsx
import React, { useEffect, useRef } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableVirtualization?: boolean;
  enableMemoization?: boolean;
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Track Core Web Vitals
  trackCLS: () => {
    if (typeof window !== 'undefined' && 'LayoutShift' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      return clsValue;
    }
    return 0;
  },

  // Track Largest Contentful Paint
  trackLCP: (callback: (value: number) => void) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        callback(lastEntry.startTime);
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  },

  // Track First Input Delay
  trackFID: (callback: (value: number) => void) => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          callback(fid);
        }
      });
      observer.observe({ type: 'first-input', buffered: true });
    }
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      const memory = (window.performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  },

  // Bundle size estimation
  estimateBundleSize: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => 
        resource.name.includes('.js') && 
        (resource.name.includes('/static/') || resource.name.includes('/assets/'))
      );
      
      const totalSize = jsResources.reduce((sum, resource) => {
        return sum + (resource.transferSize || 0);
      }, 0);
      
      return Math.round(totalSize / 1024); // KB
    }
    return 0;
  }
};

// Intersection Observer hook for performance optimization
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, callback, options]);
};

// Debounced scroll hook for performance
export const useDebouncedScroll = (
  callback: (scrollY: number) => void,
  delay: number = 100
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(window.scrollY);
      }, delay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, delay]);
};

// Image preloading utility
export const preloadCriticalImages = (imageUrls: string[]) => {
  if (typeof window === 'undefined') return;

  imageUrls.forEach((url, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    if (index < 3) {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);
  });
};

// Lazy loading utility for non-critical CSS
export const loadNonCriticalCSS = (href: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};

// Performance optimizer component
const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ 
  children, 
  enableVirtualization = false,
  enableMemoization = true 
}) => {
  // Track performance metrics on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Track LCP
      performanceMonitor.trackLCP((lcp) => {
        console.log('🎯 LCP:', Math.round(lcp), 'ms');
      });

      // Track FID
      performanceMonitor.trackFID((fid) => {
        console.log('⚡ FID:', Math.round(fid), 'ms');
      });

      // Track memory usage
      const memoryUsage = performanceMonitor.getMemoryUsage();
      if (memoryUsage) {
        console.log('🧠 Memory usage:', memoryUsage);
      }

      // Track bundle size
      setTimeout(() => {
        const bundleSize = performanceMonitor.estimateBundleSize();
        console.log('📦 Estimated bundle size:', bundleSize, 'KB');
      }, 2000);
    }
  }, []);

  // Apply performance optimizations
  const optimizedStyle: React.CSSProperties = {
    willChange: 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    // Improve scroll performance
    overflowAnchor: 'none',
    // Optimize for touch devices
    touchAction: 'manipulation'
  };

  // Conditionally wrap children with memo for performance
  const OptimizedChildren = enableMemoization 
    ? React.memo(({ children }: { children: React.ReactNode }) => <>{children}</>)
    : React.Fragment;

  return (
    <div style={optimizedStyle}>
      <OptimizedChildren>{children}</OptimizedChildren>
    </div>
  );
};

export default PerformanceOptimizer;