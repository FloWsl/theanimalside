// 📊 Database Performance Monitoring and Benchmarks
// Comprehensive performance tracking for database operations

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

interface PerformanceBenchmark {
  operation: string;
  target_ms: number;
  warning_ms: number;
  critical_ms: number;
  description: string;
}

class DatabasePerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private benchmarks: Record<string, PerformanceBenchmark> = {
    'organization.getBasicInfo': {
      operation: 'organization.getBasicInfo',
      target_ms: 200,
      warning_ms: 500,
      critical_ms: 1000,
      description: 'Fetch basic organization information'
    },
    'organization.getOverview': {
      operation: 'organization.getOverview',
      target_ms: 800,
      warning_ms: 1500,
      critical_ms: 2500,
      description: 'Fetch complete overview tab data'
    },
    'organization.getExperience': {
      operation: 'organization.getExperience',
      target_ms: 600,
      warning_ms: 1200,
      critical_ms: 2000,
      description: 'Fetch experience tab data'
    },
    'organization.getPractical': {
      operation: 'organization.getPractical',
      target_ms: 400,
      warning_ms: 800,
      critical_ms: 1500,
      description: 'Fetch practical tab data'
    },
    'organization.getStories': {
      operation: 'organization.getStories',
      target_ms: 300,
      warning_ms: 600,
      critical_ms: 1200,
      description: 'Fetch stories tab data'
    },
    'organization.getEssentials': {
      operation: 'organization.getEssentials',
      target_ms: 500,
      warning_ms: 1000,
      critical_ms: 1800,
      description: 'Fetch essential sidebar data'
    },
    'testimonials.getPaginated': {
      operation: 'testimonials.getPaginated',
      target_ms: 200,
      warning_ms: 400,
      critical_ms: 800,
      description: 'Fetch paginated testimonials'
    },
    'media.getPaginated': {
      operation: 'media.getPaginated',
      target_ms: 150,
      warning_ms: 300,
      critical_ms: 600,
      description: 'Fetch paginated media items'
    },
    'contact.submit': {
      operation: 'contact.submit',
      target_ms: 300,
      warning_ms: 600,
      critical_ms: 1200,
      description: 'Submit contact form'
    },
    'application.submit': {
      operation: 'application.submit',
      target_ms: 500,
      warning_ms: 1000,
      critical_ms: 2000,
      description: 'Submit volunteer application'
    },
    'organization.search': {
      operation: 'organization.search',
      target_ms: 400,
      warning_ms: 800,
      critical_ms: 1500,
      description: 'Search organizations with filters'
    }
  };

  /**
   * Wrap a database operation with performance monitoring
   */
  async measureOperation<T>(
    operation: string,
    asyncOperation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();
    
    try {
      const result = await asyncOperation();
      const duration = performance.now() - startTime;
      
      // Record successful operation
      this.recordMetric({
        operation,
        duration,
        timestamp,
        success: true,
        metadata
      });
      
      // Check against benchmarks
      this.checkBenchmark(operation, duration);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Record failed operation
      this.recordMetric({
        operation,
        duration,
        timestamp,
        success: false,
        errorMessage: error.message,
        metadata
      });
      
      // Log performance even for failed operations
      this.checkBenchmark(operation, duration, true);
      
      throw error;
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics to prevent memory bloat
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const status = metric.success ? '✅' : '❌';
      const duration = `${metric.duration.toFixed(1)}ms`;
      console.log(`${status} ${metric.operation}: ${duration}`);
    }
  }

  /**
   * Check operation against performance benchmarks
   */
  private checkBenchmark(operation: string, duration: number, isError: boolean = false): void {
    const benchmark = this.benchmarks[operation];
    if (!benchmark) return;

    const level = this.getPerformanceLevel(duration, benchmark);
    
    // Log warnings and critical issues
    if (level === 'warning' || level === 'critical') {
      const emoji = level === 'warning' ? '⚠️' : '🚨';
      const target = `(target: ${benchmark.target_ms}ms)`;
      
      console.warn(
        `${emoji} Slow ${operation}: ${duration.toFixed(1)}ms ${target}`,
        { benchmark, isError }
      );
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && level !== 'excellent') {
      this.sendAnalytics({
        event: 'database_performance',
        operation,
        duration,
        level,
        isError,
        benchmark
      });
    }
  }

  /**
   * Get performance level based on benchmarks
   */
  private getPerformanceLevel(
    duration: number, 
    benchmark: PerformanceBenchmark
  ): 'excellent' | 'good' | 'warning' | 'critical' {
    if (duration <= benchmark.target_ms) return 'excellent';
    if (duration <= benchmark.warning_ms) return 'good';
    if (duration <= benchmark.critical_ms) return 'warning';
    return 'critical';
  }

  /**
   * Get performance statistics
   */
  getStats(operation?: string): {
    totalOperations: number;
    averageDuration: number;
    successRate: number;
    p95Duration: number;
    p99Duration: number;
    recentOperations: PerformanceMetric[];
  } {
    const filteredMetrics = operation 
      ? this.metrics.filter(m => m.operation === operation)
      : this.metrics;

    if (filteredMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        successRate: 0,
        p95Duration: 0,
        p99Duration: 0,
        recentOperations: []
      };
    }

    const durations = filteredMetrics.map(m => m.duration).sort((a, b) => a - b);
    const successfulOperations = filteredMetrics.filter(m => m.success).length;

    return {
      totalOperations: filteredMetrics.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      successRate: (successfulOperations / filteredMetrics.length) * 100,
      p95Duration: durations[Math.floor(durations.length * 0.95)] || 0,
      p99Duration: durations[Math.floor(durations.length * 0.99)] || 0,
      recentOperations: filteredMetrics.slice(-10)
    };
  }

  /**
   * Get benchmark status for all operations
   */
  getBenchmarkStatus(): Record<string, {
    benchmark: PerformanceBenchmark;
    recentStats: ReturnType<typeof this.getStats>;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  }> {
    const status: Record<string, any> = {};

    Object.values(this.benchmarks).forEach(benchmark => {
      const stats = this.getStats(benchmark.operation);
      const level = stats.averageDuration > 0 
        ? this.getPerformanceLevel(stats.averageDuration, benchmark)
        : 'excellent';

      status[benchmark.operation] = {
        benchmark,
        recentStats: stats,
        status: level
      };
    });

    return status;
  }

  /**
   * Send analytics data (production)
   */
  private sendAnalytics(data: any): void {
    // In production, send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'database_performance', {
        custom_parameter_operation: data.operation,
        custom_parameter_duration: Math.round(data.duration),
        custom_parameter_level: data.level
      });
    }
    
    // Could also send to other analytics services like Mixpanel, Amplitude, etc.
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      benchmarks: this.benchmarks,
      metrics: this.metrics,
      stats: this.getStats(),
      benchmarkStatus: this.getBenchmarkStatus()
    }, null, 2);
  }

  /**
   * Clear metrics (for testing)
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Run performance benchmark tests
   */
  async runBenchmarkTests(): Promise<{
    results: Record<string, { duration: number; status: string }>;
    overallScore: number;
  }> {
    console.log('🏃‍♂️ Running database performance benchmarks...\n');
    
    const results: Record<string, { duration: number; status: string }> = {};
    let totalScore = 0;
    
    // Mock test functions for each operation
    const testOperations = {
      'organization.getBasicInfo': () => new Promise(resolve => setTimeout(resolve, Math.random() * 300)),
      'organization.getOverview': () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200)),
      'organization.getExperience': () => new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 100)),
      'organization.getPractical': () => new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 100)),
      'organization.getStories': () => new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100)),
      'testimonials.getPaginated': () => new Promise(resolve => setTimeout(resolve, Math.random() * 250)),
      'media.getPaginated': () => new Promise(resolve => setTimeout(resolve, Math.random() * 200)),
    };

    // Run each test 3 times and take average
    for (const [operation, testFn] of Object.entries(testOperations)) {
      const durations: number[] = [];
      
      for (let i = 0; i < 3; i++) {
        const startTime = performance.now();
        await testFn();
        const duration = performance.now() - startTime;
        durations.push(duration);
      }
      
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const benchmark = this.benchmarks[operation];
      const level = this.getPerformanceLevel(avgDuration, benchmark);
      
      results[operation] = {
        duration: avgDuration,
        status: level
      };
      
      // Calculate score (excellent=4, good=3, warning=2, critical=1)
      const scoreMap = { excellent: 4, good: 3, warning: 2, critical: 1 };
      totalScore += scoreMap[level];
      
      console.log(`${level === 'excellent' ? '✅' : level === 'good' ? '⚡' : level === 'warning' ? '⚠️' : '🚨'} ${operation}: ${avgDuration.toFixed(1)}ms (${level})`);
    }
    
    const maxPossibleScore = Object.keys(testOperations).length * 4;
    const overallScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    console.log(`\n📊 Overall Performance Score: ${overallScore}%`);
    
    return { results, overallScore };
  }
}

// Create singleton instance
export const performanceMonitor = new DatabasePerformanceMonitor();

// Export wrapper functions for easy use
export const measureDatabaseOperation = performanceMonitor.measureOperation.bind(performanceMonitor);

// Export types
export type { PerformanceMetric, PerformanceBenchmark };

// React hook for performance monitoring
import { useEffect, useState } from 'react';

export function usePerformanceMonitoring() {
  const [stats, setStats] = useState(performanceMonitor.getStats());
  const [benchmarkStatus, setBenchmarkStatus] = useState(performanceMonitor.getBenchmarkStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(performanceMonitor.getStats());
      setBenchmarkStatus(performanceMonitor.getBenchmarkStatus());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    benchmarkStatus,
    exportMetrics: () => performanceMonitor.exportMetrics(),
    runBenchmarks: () => performanceMonitor.runBenchmarkTests()
  };
}

// Console command for manual benchmark testing
if (typeof window !== 'undefined') {
  (window as any).runDatabaseBenchmarks = () => {
    return performanceMonitor.runBenchmarkTests();
  };
  
  (window as any).getPerformanceStats = (operation?: string) => {
    return performanceMonitor.getStats(operation);
  };
  
  (window as any).exportPerformanceMetrics = () => {
    const data = performanceMonitor.exportMetrics();
    console.log('📊 Performance Metrics Exported:');
    console.log(data);
    
    // Download as file
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
}