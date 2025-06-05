// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\utils\analytics\performanceMonitor.ts

/**
 * Performance Monitoring System for Discovery Section
 * 
 * Monitors Core Web Vitals, animation performance, and user experience metrics
 * to ensure the search-free header maintains award-winning performance standards.
 */

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  
  // Custom metrics
  discoveryLoadTime?: number;
  animationFrameRate?: number;
  interactionDelay?: number;
  memoryUsage?: number;
  bundleSize?: number;
  
  // User experience metrics
  timeToInteractive?: number;
  headerRenderTime?: number;
  imageLoadTime?: number;
}

// Performance thresholds (Google Core Web Vitals standards)
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  FID: { good: 100, poor: 300 },   // milliseconds  
  CLS: { good: 0.1, poor: 0.25 },  // score
  
  // Custom thresholds
  discoveryLoadTime: { good: 1500, poor: 3000 },
  animationFrameRate: { good: 58, poor: 30 }, // FPS
  interactionDelay: { good: 50, poor: 200 },
  timeToInteractive: { good: 3000, poor: 5000 }
};

// Performance grade
export type PerformanceGrade = 'excellent' | 'good' | 'needs-improvement' | 'poor';

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number = performance.now();
  private frameCount: number = 0;
  private lastFrameTime: number = performance.now();
  private reportCallback?: (metrics: PerformanceMetrics) => void;

  constructor(reportCallback?: (metrics: PerformanceMetrics) => void) {
    this.reportCallback = reportCallback;
    this.initializeMonitoring();
  }

  /**
   * Initialize all performance monitoring
   */
  private initializeMonitoring() {
    this.monitorCoreWebVitals();
    this.monitorAnimationPerformance();
    this.monitorMemoryUsage();
    this.monitorDiscoverySection();
    this.setupReporting();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP monitoring not supported');
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          this.reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID monitoring not supported');
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.CLS = clsValue;
            this.reportMetric('CLS', clsValue);
          }
        });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS monitoring not supported');
      }
    }
  }

  /**
   * Monitor animation frame rate
   */
  private monitorAnimationPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    const frameWindow = 60; // Calculate FPS over 60 frames

    const measureFrameRate = (currentTime: number) => {
      frameCount++;
      
      if (frameCount >= frameWindow) {
        const fps = Math.round(1000 * frameWindow / (currentTime - lastTime));
        this.metrics.animationFrameRate = fps;
        this.reportMetric('animationFrameRate', fps);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrameRate);
    };
    
    requestAnimationFrame(measureFrameRate);
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.reportMetric('memoryUsage', memory.usedJSHeapSize);
      };
      
      // Check memory every 10 seconds
      setInterval(checkMemory, 10000);
      checkMemory(); // Initial check
    }
  }

  /**
   * Monitor Discovery section specific metrics
   */
  private monitorDiscoverySection() {
    // Monitor when Discovery section becomes visible
    const discoveryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id === 'discovery-section') {
            const loadTime = performance.now() - this.startTime;
            this.metrics.discoveryLoadTime = loadTime;
            this.reportMetric('discoveryLoadTime', loadTime);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.attachDiscoveryObserver(discoveryObserver);
      });
    } else {
      this.attachDiscoveryObserver(discoveryObserver);
    }
  }

  /**
   * Attach observer to discovery section
   */
  private attachDiscoveryObserver(observer: IntersectionObserver) {
    // Look for discovery section
    const discoverySection = document.querySelector('[data-section="discovery"]') || 
                           document.querySelector('#discovery-section');
    
    if (discoverySection) {
      observer.observe(discoverySection);
    } else {
      // Retry after a short delay
      setTimeout(() => this.attachDiscoveryObserver(observer), 1000);
    }
  }

  /**
   * Measure interaction delay
   */
  measureInteractionDelay(startTime: number): number {
    const delay = performance.now() - startTime;
    this.metrics.interactionDelay = delay;
    this.reportMetric('interactionDelay', delay);
    return delay;
  }

  /**
   * Measure header render time
   */
  measureHeaderRenderTime(headerType: string) {
    const renderStart = performance.now();
    
    // Use RAF to ensure measurement after render
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      this.metrics.headerRenderTime = renderTime;
      this.reportMetric(`headerRenderTime_${headerType}`, renderTime);
    });
  }

  /**
   * Measure image load times
   */
  measureImageLoadTimes() {
    const images = document.querySelectorAll('img[src*="unsplash"]');
    let totalLoadTime = 0;
    let loadedCount = 0;
    
    images.forEach((img) => {
      const startTime = performance.now();
      
      const onLoad = () => {
        const loadTime = performance.now() - startTime;
        totalLoadTime += loadTime;
        loadedCount++;
        
        if (loadedCount === images.length) {
          this.metrics.imageLoadTime = totalLoadTime / loadedCount;
          this.reportMetric('averageImageLoadTime', totalLoadTime / loadedCount);
        }
      };
      
      if (img.complete) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
      }
    });
  }

  /**
   * Setup automatic reporting
   */
  private setupReporting() {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });
  }

  /**
   * Report individual metric
   */
  private reportMetric(name: string, value: number) {
    if (this.reportCallback) {
      this.reportCallback({ [name]: value });
    }
    
    // Log performance issues
    this.checkPerformanceThresholds(name, value);
  }

  /**
   * Check if metrics meet performance thresholds
   */
  private checkPerformanceThresholds(name: string, value: number) {
    const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return;

    if (value > threshold.poor) {
      console.warn(`⚠️ Poor ${name}: ${value} (threshold: ${threshold.poor})`);
    } else if (value > threshold.good) {
      console.info(`⚡ ${name} needs improvement: ${value} (threshold: ${threshold.good})`);
    } else {
      console.log(`✅ Good ${name}: ${value}`);
    }
  }

  /**
   * Get performance grade for a metric
   */
  getPerformanceGrade(metricName: string, value: number): PerformanceGrade {
    const threshold = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good * 0.8) return 'excellent';
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get overall performance score (0-100)
   */
  getPerformanceScore(): number {
    const scores: number[] = [];
    
    // Core Web Vitals (weighted heavily)
    if (this.metrics.LCP) {
      const lcpScore = this.calculateMetricScore('LCP', this.metrics.LCP);
      scores.push(lcpScore * 0.3); // 30% weight
    }
    
    if (this.metrics.FID) {
      const fidScore = this.calculateMetricScore('FID', this.metrics.FID);
      scores.push(fidScore * 0.3); // 30% weight
    }
    
    if (this.metrics.CLS) {
      const clsScore = this.calculateMetricScore('CLS', this.metrics.CLS);
      scores.push(clsScore * 0.2); // 20% weight
    }
    
    // Custom metrics
    if (this.metrics.animationFrameRate) {
      const fpsScore = this.calculateMetricScore('animationFrameRate', this.metrics.animationFrameRate);
      scores.push(fpsScore * 0.2); // 20% weight
    }
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0)) : 0;
  }

  /**
   * Calculate score for individual metric (0-100)
   */
  private calculateMetricScore(metricName: string, value: number): number {
    const threshold = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!threshold) return 100;

    if (value <= threshold.good) {
      return 100;
    } else if (value <= threshold.poor) {
      // Linear interpolation between good and poor
      const range = threshold.poor - threshold.good;
      const position = value - threshold.good;
      return Math.max(0, 100 - (position / range) * 50);
    } else {
      return Math.max(0, 50 - ((value - threshold.poor) / threshold.poor) * 50);
    }
  }

  /**
   * Report all current metrics
   */
  reportMetrics() {
    if (this.reportCallback) {
      this.reportCallback({ ...this.metrics });
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {};
    this.startTime = performance.now();
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor((metrics) => {
  // Default reporting to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics);
  }
});

// Export utility functions
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  performanceMonitor.reportMetric(name, duration);
  return duration;
};

export const measureAsyncPerformance = async (name: string, fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  const duration = performance.now() - start;
  performanceMonitor.reportMetric(name, duration);
  return duration;
};

// Export types
export type { PerformanceMetrics, PerformanceGrade };
export { PERFORMANCE_THRESHOLDS };
