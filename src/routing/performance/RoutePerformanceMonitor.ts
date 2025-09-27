/**
 * Route Performance Architecture & Monitoring System
 *
 * Real-time performance tracking and optimization for the route system.
 * Ensures all components meet aggressive performance targets.
 *
 * Targets:
 * - Route resolution: <50ms → <25ms (50% improvement)
 * - Validation: <100ms → <1ms (99% improvement)
 * - Memory usage: Stable with <10MB increase under load
 * - Cache hit rate: >95%
 */

import type { RouteDefinition } from './RouteDefinition';

// ============================================================================
// PERFORMANCE MONITORING TYPES
// ============================================================================

export interface PerformanceMetric {
  operation: string;
  duration: number;          // milliseconds
  timestamp: number;
  metadata?: Record<string, any>;
  memoryUsage?: number;      // bytes
  cacheHit?: boolean;
}

export interface PerformanceTarget {
  operation: string;
  targetMs: number;
  criticalMs: number;        // Alert threshold
  samples: number;           // Number of samples to track
  alertCallback?: (metric: PerformanceMetric) => void;
}

export interface PerformanceReport {
  operation: string;
  averageDuration: number;
  medianDuration: number;
  p95Duration: number;
  p99Duration: number;
  totalSamples: number;
  targetsmet: boolean;
  trend: 'improving' | 'stable' | 'degrading';
  recommendations: string[];
}

export interface SystemHealthMetrics {
  memoryUsage: {
    current: number;
    peak: number;
    average: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  cachePerformance: {
    hitRate: number;
    missRate: number;
    evictionRate: number;
    averageLookupTime: number;
  };
  routeResolution: {
    averageTime: number;
    slowestRoutes: Array<{ route: string; avgTime: number }>;
    fastestRoutes: Array<{ route: string; avgTime: number }>;
  };
  validation: {
    averageTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

// ============================================================================
// PERFORMANCE TARGETS CONFIGURATION
// ============================================================================

export const PERFORMANCE_TARGETS: PerformanceTarget[] = [
  {
    operation: 'route_generation',
    targetMs: 10,
    criticalMs: 50,
    samples: 100
  },
  {
    operation: 'route_validation',
    targetMs: 1,
    criticalMs: 5,
    samples: 1000
  },
  {
    operation: 'route_resolution',
    targetMs: 25,      // 50% improvement from current 50ms
    criticalMs: 50,
    samples: 500
  },
  {
    operation: 'cache_lookup',
    targetMs: 0.1,
    criticalMs: 1,
    samples: 5000
  },
  {
    operation: 'fuzzy_matching',
    targetMs: 10,
    criticalMs: 50,
    samples: 200
  },
  {
    operation: 'navigation_flow_validation',
    targetMs: 5,
    criticalMs: 20,
    samples: 100
  }
];

// ============================================================================
// CACHING STRATEGY IMPLEMENTATION
// ============================================================================

export interface CacheStrategy {
  level: 'memory' | 'sessionStorage' | 'localStorage' | 'serviceWorker';
  ttl: number;               // Time to live in milliseconds
  maxSize: number;           // Maximum entries
  evictionPolicy: 'lru' | 'lfu' | 'ttl' | 'manual';
  compression: boolean;
  encryption: boolean;
}

export const CACHE_CONFIGURATIONS: Record<string, CacheStrategy> = {
  'route-validation': {
    level: 'memory',
    ttl: 5 * 60 * 1000,      // 5 minutes
    maxSize: 10000,
    evictionPolicy: 'lru',
    compression: false,
    encryption: false
  },
  'route-metadata': {
    level: 'localStorage',
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 1000,
    evictionPolicy: 'ttl',
    compression: true,
    encryption: false
  },
  'navigation-context': {
    level: 'sessionStorage',
    ttl: 30 * 60 * 1000,     // 30 minutes
    maxSize: 100,
    evictionPolicy: 'ttl',
    compression: false,
    encryption: false
  },
  'performance-metrics': {
    level: 'memory',
    ttl: 60 * 60 * 1000,     // 1 hour
    maxSize: 5000,
    evictionPolicy: 'lru',
    compression: false,
    encryption: false
  }
};

// ============================================================================
// ADVANCED CACHE IMPLEMENTATION
// ============================================================================

class AdvancedCache<T> {
  private cache: Map<string, { value: T; timestamp: number; hits: number }> = new Map();
  private strategy: CacheStrategy;
  private accessOrder: string[] = []; // For LRU
  private hitCount = 0;
  private missCount = 0;

  constructor(strategy: CacheStrategy) {
    this.strategy = strategy;
  }

  set(key: string, value: T): void {
    const now = Date.now();

    // Evict if at capacity
    if (this.cache.size >= this.strategy.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      value: this.strategy.compression ? this.compress(value) : value,
      timestamp: now,
      hits: 0
    });

    // Update access order for LRU
    if (this.strategy.evictionPolicy === 'lru') {
      this.updateAccessOrder(key);
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.strategy.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.missCount++;
      return null;
    }

    // Update statistics
    entry.hits++;
    this.hitCount++;

    // Update access order for LRU
    if (this.strategy.evictionPolicy === 'lru') {
      this.updateAccessOrder(key);
    }

    return this.strategy.compression ? this.decompress(entry.value) : entry.value;
  }

  getStats(): {
    size: number;
    hitRate: number;
    memoryUsage: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    let memoryUsage = 0;

    this.cache.forEach(entry => {
      oldestTimestamp = Math.min(oldestTimestamp, entry.timestamp);
      newestTimestamp = Math.max(newestTimestamp, entry.timestamp);
      memoryUsage += this.estimateSize(entry.value);
    });

    return {
      size: this.cache.size,
      hitRate,
      memoryUsage,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp
    };
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.hitCount = 0;
    this.missCount = 0;
  }

  private evict(): void {
    switch (this.strategy.evictionPolicy) {
      case 'lru':
        this.evictLRU();
        break;
      case 'lfu':
        this.evictLFU();
        break;
      case 'ttl':
        this.evictExpired();
        break;
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder[0];
      this.cache.delete(oldestKey);
      this.accessOrder.shift();
    }
  }

  private evictLFU(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.hits < leastHits) {
        leastHits = entry.hits;
        leastUsedKey = key;
      }
    });

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      this.removeFromAccessOrder(leastUsedKey);
    }
  }

  private evictExpired(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.strategy.ttl) {
        toDelete.push(key);
      }
    });

    toDelete.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    });
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private compress(value: T): T {
    // Simple compression simulation - in real implementation, use actual compression
    return value;
  }

  private decompress(value: T): T {
    // Simple decompression simulation
    return value;
  }

  private estimateSize(value: any): number {
    // Rough memory estimation in bytes
    if (typeof value === 'string') {
      return value.length * 2; // UTF-16
    }
    if (typeof value === 'object') {
      return JSON.stringify(value).length * 2;
    }
    return 8; // Primitive types
  }
}

// ============================================================================
// MAIN PERFORMANCE MONITOR
// ============================================================================

export class RoutePerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private targets: Map<string, PerformanceTarget> = new Map();
  private caches: Map<string, AdvancedCache<any>> = new Map();
  private alertCallbacks: Array<(metric: PerformanceMetric) => void> = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    // Initialize performance targets
    PERFORMANCE_TARGETS.forEach(target => {
      this.targets.set(target.operation, target);
      this.metrics.set(target.operation, []);
    });

    // Initialize caches
    Object.entries(CACHE_CONFIGURATIONS).forEach(([name, config]) => {
      this.caches.set(name, new AdvancedCache(config));
    });
  }

  // ========================================================================
  // PERFORMANCE TRACKING API
  // ========================================================================

  /**
   * Start performance monitoring operation
   */
  startOperation(operation: string): () => void {
    const startTime = performance.now();
    const startMemory = this.getCurrentMemoryUsage();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      const endMemory = this.getCurrentMemoryUsage();

      this.recordMetric({
        operation,
        duration,
        timestamp: Date.now(),
        memoryUsage: endMemory - startMemory
      });
    };
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    const operationMetrics = this.metrics.get(metric.operation) || [];
    operationMetrics.push(metric);

    const target = this.targets.get(metric.operation);
    if (target) {
      // Keep only the specified number of samples
      if (operationMetrics.length > target.samples) {
        operationMetrics.splice(0, operationMetrics.length - target.samples);
      }

      // Check if metric exceeds critical threshold
      if (metric.duration > target.criticalMs) {
        this.triggerAlert(metric);
      }
    }

    this.metrics.set(metric.operation, operationMetrics);
  }

  /**
   * Get performance report for operation
   */
  getPerformanceReport(operation: string): PerformanceReport | null {
    const operationMetrics = this.metrics.get(operation);
    const target = this.targets.get(operation);

    if (!operationMetrics || operationMetrics.length === 0) {
      return null;
    }

    const durations = operationMetrics.map(m => m.duration).sort((a, b) => a - b);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const medianDuration = durations[Math.floor(durations.length / 2)];
    const p95Duration = durations[Math.floor(durations.length * 0.95)];
    const p99Duration = durations[Math.floor(durations.length * 0.99)];

    const targetsMetTarget = target ? averageDuration <= target.targetMs : true;
    const trend = this.calculateTrend(operationMetrics);
    const recommendations = this.generateRecommendations(operation, operationMetrics, target);

    return {
      operation,
      averageDuration,
      medianDuration,
      p95Duration,
      p99Duration,
      totalSamples: operationMetrics.length,
      targetsMetTarget,
      trend,
      recommendations
    };
  }

  /**
   * Get comprehensive system health metrics
   */
  getSystemHealth(): SystemHealthMetrics {
    const memoryMetrics = this.calculateMemoryMetrics();
    const cacheMetrics = this.calculateCacheMetrics();
    const routeMetrics = this.calculateRouteMetrics();
    const validationMetrics = this.calculateValidationMetrics();

    return {
      memoryUsage: memoryMetrics,
      cachePerformance: cacheMetrics,
      routeResolution: routeMetrics,
      validation: validationMetrics
    };
  }

  /**
   * Get cache by name
   */
  getCache<T>(name: string): AdvancedCache<T> | null {
    return this.caches.get(name) || null;
  }

  /**
   * Add alert callback
   */
  onAlert(callback: (metric: PerformanceMetric) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  private getCurrentMemoryUsage(): number {
    // In a real implementation, this would use performance.memory or process.memoryUsage()
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private triggerAlert(metric: PerformanceMetric): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(metric);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  private calculateTrend(metrics: PerformanceMetric[]): 'improving' | 'stable' | 'degrading' {
    if (metrics.length < 10) return 'stable';

    const recent = metrics.slice(-10);
    const older = metrics.slice(-20, -10);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, m) => sum + m.duration, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.duration, 0) / older.length;

    const changePercent = (recentAvg - olderAvg) / olderAvg;

    if (changePercent < -0.05) return 'improving';  // 5% improvement
    if (changePercent > 0.05) return 'degrading';   // 5% degradation
    return 'stable';
  }

  private generateRecommendations(
    operation: string,
    metrics: PerformanceMetric[],
    target?: PerformanceTarget
  ): string[] {
    const recommendations: string[] = [];
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;

    if (target && avgDuration > target.targetMs) {
      const exceedingBy = ((avgDuration - target.targetMs) / target.targetMs * 100).toFixed(1);
      recommendations.push(`Performance is ${exceedingBy}% slower than target (${target.targetMs}ms)`);
    }

    // Operation-specific recommendations
    switch (operation) {
      case 'route_validation':
        if (avgDuration > 1) {
          recommendations.push('Consider increasing cache size or precomputing more validations');
        }
        break;
      case 'route_generation':
        if (avgDuration > 10) {
          recommendations.push('Route generation is slow - consider optimizing data structures');
        }
        break;
      case 'fuzzy_matching':
        if (avgDuration > 10) {
          recommendations.push('Fuzzy matching is slow - consider reducing search space or algorithm optimization');
        }
        break;
    }

    return recommendations;
  }

  private calculateMemoryMetrics() {
    const currentUsage = this.getCurrentMemoryUsage();
    const allMetrics = Array.from(this.metrics.values()).flat();
    const memoryReadings = allMetrics
      .map(m => m.memoryUsage)
      .filter(usage => usage !== undefined) as number[];

    return {
      current: currentUsage,
      peak: Math.max(...memoryReadings, currentUsage),
      average: memoryReadings.length > 0 ? memoryReadings.reduce((sum, usage) => sum + usage, 0) / memoryReadings.length : 0,
      trend: 'stable' as const // Would calculate based on historical data
    };
  }

  private calculateCacheMetrics() {
    let totalHits = 0;
    let totalMisses = 0;
    const totalLookupTime = 0;
    let cacheCount = 0;

    this.caches.forEach(cache => {
      const stats = cache.getStats();
      const hits = stats.hitRate * 100; // Assuming hitRate is already calculated
      totalHits += hits;
      totalMisses += (100 - hits);
      cacheCount++;
    });

    const avgHitRate = cacheCount > 0 ? totalHits / cacheCount / 100 : 0;

    return {
      hitRate: avgHitRate,
      missRate: 1 - avgHitRate,
      evictionRate: 0, // Would track evictions
      averageLookupTime: totalLookupTime / Math.max(cacheCount, 1)
    };
  }

  private calculateRouteMetrics() {
    const routeMetrics = this.metrics.get('route_resolution') || [];
    const avgTime = routeMetrics.length > 0
      ? routeMetrics.reduce((sum, m) => sum + m.duration, 0) / routeMetrics.length
      : 0;

    // Group by route for slowest/fastest analysis
    const routeGroups = new Map<string, number[]>();
    routeMetrics.forEach(metric => {
      if (metric.metadata?.route) {
        const route = metric.metadata.route;
        if (!routeGroups.has(route)) {
          routeGroups.set(route, []);
        }
        routeGroups.get(route)!.push(metric.duration);
      }
    });

    const routeAverages = Array.from(routeGroups.entries()).map(([route, durations]) => ({
      route,
      avgTime: durations.reduce((sum, d) => sum + d, 0) / durations.length
    }));

    const slowestRoutes = routeAverages.sort((a, b) => b.avgTime - a.avgTime).slice(0, 5);
    const fastestRoutes = routeAverages.sort((a, b) => a.avgTime - b.avgTime).slice(0, 5);

    return {
      averageTime: avgTime,
      slowestRoutes,
      fastestRoutes
    };
  }

  private calculateValidationMetrics() {
    const validationMetrics = this.metrics.get('route_validation') || [];
    const avgTime = validationMetrics.length > 0
      ? validationMetrics.reduce((sum, m) => sum + m.duration, 0) / validationMetrics.length
      : 0;

    const cacheHits = validationMetrics.filter(m => m.cacheHit).length;
    const cacheHitRate = validationMetrics.length > 0 ? cacheHits / validationMetrics.length : 0;

    // Calculate error rate (would need error tracking)
    const errorRate = 0; // Placeholder

    return {
      averageTime: avgTime,
      cacheHitRate,
      errorRate
    };
  }

  private performHealthCheck(): void {
    const health = this.getSystemHealth();

    // Log health status
    console.log('🔍 Route System Health Check:', {
      memory: `${(health.memoryUsage.current / 1024 / 1024).toFixed(2)}MB`,
      cacheHitRate: `${(health.cachePerformance.hitRate * 100).toFixed(1)}%`,
      avgRouteTime: `${health.routeResolution.averageTime.toFixed(2)}ms`,
      avgValidationTime: `${health.validation.averageTime.toFixed(2)}ms`
    });

    // Trigger alerts for concerning metrics
    if (health.cachePerformance.hitRate < 0.95) {
      this.triggerAlert({
        operation: 'cache_performance',
        duration: health.cachePerformance.hitRate,
        timestamp: Date.now(),
        metadata: { type: 'low_hit_rate', value: health.cachePerformance.hitRate }
      });
    }

    if (health.memoryUsage.current > 50 * 1024 * 1024) { // 50MB threshold
      this.triggerAlert({
        operation: 'memory_usage',
        duration: health.memoryUsage.current,
        timestamp: Date.now(),
        metadata: { type: 'high_memory_usage', value: health.memoryUsage.current }
      });
    }
  }

  // ========================================================================
  // TEST-COMPATIBLE API METHODS
  // ========================================================================

  /**
   * Track route validation performance
   */
  trackRouteValidation(routeId: string, validationTime: number, success: boolean): void {
    this.recordMetric({
      operation: 'route_validation',
      duration: validationTime,
      timestamp: Date.now(),
      metadata: { routeId, success }
    });
  }

  /**
   * Track route resolution performance
   */
  trackRouteResolution(routeId: string, resolutionTime: number, success: boolean): void {
    this.recordMetric({
      operation: 'route_resolution',
      duration: resolutionTime,
      timestamp: Date.now(),
      metadata: { routeId, success }
    });
  }

  /**
   * Track route rendering performance
   */
  trackRouteRendering(routeId: string, renderingTime: number, success: boolean): void {
    this.recordMetric({
      operation: 'route_rendering',
      duration: renderingTime,
      timestamp: Date.now(),
      metadata: { routeId, success }
    });
  }

  /**
   * Get performance data for a specific route
   */
  getRoutePerformance(routeId: string): {
    avgValidationTime: number;
    avgResolutionTime: number;
    avgRenderingTime: number;
    successRate: number;
  } {
    const validationMetrics = this.metrics.get('route_validation')?.filter(m => m.metadata?.routeId === routeId) || [];
    const resolutionMetrics = this.metrics.get('route_resolution')?.filter(m => m.metadata?.routeId === routeId) || [];
    const renderingMetrics = this.metrics.get('route_rendering')?.filter(m => m.metadata?.routeId === routeId) || [];

    const avgValidationTime = validationMetrics.length > 0
      ? validationMetrics.reduce((sum, m) => sum + m.duration, 0) / validationMetrics.length
      : 0;

    const avgResolutionTime = resolutionMetrics.length > 0
      ? resolutionMetrics.reduce((sum, m) => sum + m.duration, 0) / resolutionMetrics.length
      : 0;

    const avgRenderingTime = renderingMetrics.length > 0
      ? renderingMetrics.reduce((sum, m) => sum + m.duration, 0) / renderingMetrics.length
      : 0;

    const allMetrics = [...validationMetrics, ...resolutionMetrics, ...renderingMetrics];
    const successCount = allMetrics.filter(m => m.metadata?.success === true).length;
    const successRate = allMetrics.length > 0 ? successCount / allMetrics.length : 1;

    return {
      avgValidationTime,
      avgResolutionTime,
      avgRenderingTime,
      successRate
    };
  }

  /**
   * Get optimization recommendations for slow routes
   */
  getOptimizationRecommendations(): Array<{
    routeId: string;
    issue: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations: Array<{
      routeId: string;
      issue: string;
      recommendation: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Get all unique route IDs
    const routeIds = new Set<string>();
    this.metrics.forEach(metricArray => {
      metricArray.forEach(metric => {
        if (metric.metadata?.routeId) {
          routeIds.add(metric.metadata.routeId);
        }
      });
    });

    // Analyze each route for performance issues
    routeIds.forEach(routeId => {
      const performance = this.getRoutePerformance(routeId);

      // Slow validation
      if (performance.avgValidationTime > 5) {
        recommendations.push({
          routeId,
          issue: `Slow validation: ${performance.avgValidationTime.toFixed(2)}ms`,
          recommendation: 'Implement validation caching or optimize validation logic',
          priority: performance.avgValidationTime > 10 ? 'high' : 'medium'
        });
      }

      // Slow resolution
      if (performance.avgResolutionTime > 50) {
        recommendations.push({
          routeId,
          issue: `Slow resolution: ${performance.avgResolutionTime.toFixed(2)}ms`,
          recommendation: 'Optimize route matching patterns or add route caching',
          priority: performance.avgResolutionTime > 100 ? 'high' : 'medium'
        });
      }

      // Slow rendering
      if (performance.avgRenderingTime > 200) {
        recommendations.push({
          routeId,
          issue: `Slow rendering: ${performance.avgRenderingTime.toFixed(2)}ms`,
          recommendation: 'Implement component lazy loading or reduce bundle size',
          priority: performance.avgRenderingTime > 500 ? 'high' : 'medium'
        });
      }

      // Low success rate
      if (performance.successRate < 0.9) {
        recommendations.push({
          routeId,
          issue: `Low success rate: ${(performance.successRate * 100).toFixed(1)}%`,
          recommendation: 'Investigate and fix validation or resolution failures',
          priority: performance.successRate < 0.8 ? 'high' : 'medium'
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

export default RoutePerformanceMonitor;