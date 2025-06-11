// Performance monitoring for Smart Navigation system
export interface NavigationPerformanceMetrics {
  recommendationGenerationTime: number;
  cacheHitRate: number;
  clickThroughRate: number;
  averageTimeToClick: number;
  loadingTime: number;
}

class NavigationPerformanceMonitor {
  private metrics: Map<string, any> = new Map();
  private startTimes: Map<string, number> = new Map();

  // Start timing a navigation operation
  startTiming(operationId: string): void {
    this.startTimes.set(operationId, performance.now());
  }

  // End timing and record the duration
  endTiming(operationId: string): number {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.startTimes.delete(operationId);
    
    // Store metric
    const currentMetrics = this.metrics.get('timings') || [];
    currentMetrics.push({ operationId, duration, timestamp: Date.now() });
    this.metrics.set('timings', currentMetrics);
    
    return duration;
  }

  // Record cache hit/miss
  recordCacheHit(hit: boolean): void {
    const cacheMetrics = this.metrics.get('cache') || { hits: 0, misses: 0 };
    if (hit) {
      cacheMetrics.hits++;
    } else {
      cacheMetrics.misses++;
    }
    this.metrics.set('cache', cacheMetrics);
  }

  // Record navigation click
  recordClick(recommendationId: string, timeToClick: number): void {
    const clickMetrics = this.metrics.get('clicks') || [];
    clickMetrics.push({
      recommendationId,
      timeToClick,
      timestamp: Date.now()
    });
    this.metrics.set('clicks', clickMetrics);
  }

  // Get performance report
  getPerformanceReport(): NavigationPerformanceMetrics {
    const timings = this.metrics.get('timings') || [];
    const cache = this.metrics.get('cache') || { hits: 0, misses: 0 };
    const clicks = this.metrics.get('clicks') || [];

    const avgGenerationTime = timings.length > 0 
      ? timings.reduce((sum: number, t: any) => sum + t.duration, 0) / timings.length 
      : 0;

    const cacheTotal = cache.hits + cache.misses;
    const cacheHitRate = cacheTotal > 0 ? cache.hits / cacheTotal : 0;

    const avgTimeToClick = clicks.length > 0
      ? clicks.reduce((sum: number, c: any) => sum + c.timeToClick, 0) / clicks.length
      : 0;

    return {
      recommendationGenerationTime: avgGenerationTime,
      cacheHitRate,
      clickThroughRate: clicks.length, // Simplified - would need impression tracking for actual CTR
      averageTimeToClick: avgTimeToClick,
      loadingTime: avgGenerationTime
    };
  }

  // Reset metrics (useful for testing)
  reset(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }

  // Log performance to console (development only)
  logPerformance(): void {
    if (process.env.NODE_ENV === 'development') {
      const report = this.getPerformanceReport();
      console.group('🚀 Smart Navigation Performance');
      console.log('Generation Time:', `${report.recommendationGenerationTime.toFixed(2)}ms`);
      console.log('Cache Hit Rate:', `${(report.cacheHitRate * 100).toFixed(1)}%`);
      console.log('Avg Time to Click:', `${report.averageTimeToClick.toFixed(2)}ms`);
      console.groupEnd();
    }
  }
}

// Singleton instance
export const navigationPerformanceMonitor = new NavigationPerformanceMonitor();

// Performance tracking hooks for React components
export const useNavigationPerformance = () => {
  const trackOperation = (operationId: string) => {
    navigationPerformanceMonitor.startTiming(operationId);
    return () => navigationPerformanceMonitor.endTiming(operationId);
  };

  const trackClick = (recommendationId: string, startTime: number) => {
    const timeToClick = performance.now() - startTime;
    navigationPerformanceMonitor.recordClick(recommendationId, timeToClick);
  };

  const trackCacheHit = (hit: boolean) => {
    navigationPerformanceMonitor.recordCacheHit(hit);
  };

  const getReport = () => navigationPerformanceMonitor.getPerformanceReport();

  return {
    trackOperation,
    trackClick,
    trackCacheHit,
    getReport,
    logPerformance: navigationPerformanceMonitor.logPerformance.bind(navigationPerformanceMonitor)
  };
};