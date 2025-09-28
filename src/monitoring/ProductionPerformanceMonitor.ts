// src/monitoring/ProductionPerformanceMonitor.ts
// IMPLEMENTATION TARGET: Real browser API integration for comprehensive performance monitoring

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte

  // Route-specific metrics
  routeLoadTime: number;
  routeValidationTime: number;
  componentRenderTime: number;
  dataFetchTime: number;

  // System metrics
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  cacheHitRate: number;

  // User experience metrics
  errorRate: number;
  bounceRate: number;
  sessionDuration: number;
  userActions: number;

  // Timestamps
  timestamp: number;
  pageLoadTimestamp: number;
}

export interface AlertConfiguration {
  metric: keyof PerformanceMetrics;
  threshold: number;
  operator: 'greater' | 'less' | 'equal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  cooldownPeriod: number; // milliseconds
}

export interface PerformanceAlert {
  id: string;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  acknowledged: boolean;
  description: string;
}

export interface MonitoringConfiguration {
  sampleRate: number; // 0-1, percentage of sessions to monitor
  reportingInterval: number; // milliseconds
  alertConfigurations: AlertConfiguration[];
  enabledMetrics: (keyof PerformanceMetrics)[];
  persistMetrics: boolean;
  maxStoredMetrics: number;
}

export interface PerformanceReport {
  period: {
    start: number;
    end: number;
  };
  summary: {
    totalSessions: number;
    averageMetrics: Partial<PerformanceMetrics>;
    medianMetrics: Partial<PerformanceMetrics>;
    p95Metrics: Partial<PerformanceMetrics>;
    alertCount: number;
    criticalAlertCount: number;
  };
  trends: {
    metric: keyof PerformanceMetrics;
    trend: 'improving' | 'degrading' | 'stable';
    changePercentage: number;
  }[];
  recommendations: string[];
}

export class ProductionPerformanceMonitor {
  private config: MonitoringConfiguration;
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring: boolean = false;
  private sessionStartTime: number = 0;
  private lastReportTime: number = 0;
  private alertCooldowns: Map<string, number> = new Map();

  // Browser API availability checks
  private readonly hasPerformanceObserver = typeof PerformanceObserver !== 'undefined';
  private readonly hasMemoryAPI = 'memory' in performance;
  private readonly hasConnectionAPI = 'connection' in navigator;
  private readonly hasResourceTiming = 'getEntriesByType' in performance;

  constructor(config: MonitoringConfiguration) {
    this.config = config;
    this.sessionStartTime = Date.now();
    this.validateConfiguration();
    this.initializeBrowserAPIs();
  }

  /**
   * Start performance monitoring with browser API integration
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      console.warn('Performance monitoring already active');
      return;
    }

    console.log('📊 Starting production performance monitoring...');
    this.isMonitoring = true;
    this.lastReportTime = Date.now();

    // Set up Core Web Vitals monitoring
    this.setupCoreWebVitalsMonitoring();

    // Set up resource timing monitoring
    this.setupResourceTimingMonitoring();

    // Set up navigation timing monitoring
    this.setupNavigationTimingMonitoring();

    // Set up memory monitoring
    this.setupMemoryMonitoring();

    // Set up periodic metric collection
    this.setupPeriodicCollection();

    // Set up automatic reporting
    this.setupAutomaticReporting();

    console.log('✅ Performance monitoring initialized');
    console.log(`   Sample rate: ${this.config.sampleRate * 100}%`);
    console.log(`   Reporting interval: ${this.config.reportingInterval}ms`);
    console.log(`   Enabled metrics: ${this.config.enabledMetrics.length}`);
  }

  /**
   * Stop performance monitoring and cleanup
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    console.log('🛑 Stopping performance monitoring...');

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    this.isMonitoring = false;

    console.log('✅ Performance monitoring stopped');
  }

  /**
   * Get current performance metrics
   */
  public getCurrentMetrics(): PerformanceMetrics {
    const timestamp = Date.now();

    return {
      // Core Web Vitals (collected by observers)
      lcp: this.getLatestMetric('lcp'),
      fid: this.getLatestMetric('fid'),
      cls: this.getLatestMetric('cls'),
      fcp: this.getLatestMetric('fcp'),
      ttfb: this.getNavigationTiming('responseStart'),

      // Route-specific metrics
      routeLoadTime: this.measureRouteLoadTime(),
      routeValidationTime: this.measureRouteValidationTime(),
      componentRenderTime: this.measureComponentRenderTime(),
      dataFetchTime: this.measureDataFetchTime(),

      // System metrics
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.estimateCPUUsage(),
      networkLatency: this.getNetworkLatency(),
      cacheHitRate: this.calculateCacheHitRate(),

      // User experience metrics
      errorRate: this.calculateErrorRate(),
      bounceRate: this.calculateBounceRate(),
      sessionDuration: timestamp - this.sessionStartTime,
      userActions: this.countUserActions(),

      // Timestamps
      timestamp,
      pageLoadTimestamp: this.sessionStartTime
    };
  }

  /**
   * Generate comprehensive performance report
   */
  public generateReport(periodHours: number = 24): PerformanceReport {
    const now = Date.now();
    const periodStart = now - (periodHours * 60 * 60 * 1000);

    const periodMetrics = this.metrics.filter(m => m.timestamp >= periodStart);
    const periodAlerts = this.alerts.filter(a => a.timestamp >= periodStart);

    if (periodMetrics.length === 0) {
      return this.getEmptyReport(periodStart, now);
    }

    // Calculate aggregated metrics
    const averageMetrics = this.calculateAverageMetrics(periodMetrics);
    const medianMetrics = this.calculateMedianMetrics(periodMetrics);
    const p95Metrics = this.calculateP95Metrics(periodMetrics);

    // Analyze trends
    const trends = this.analyzeTrends(periodMetrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(averageMetrics, periodAlerts);

    return {
      period: { start: periodStart, end: now },
      summary: {
        totalSessions: periodMetrics.length,
        averageMetrics,
        medianMetrics,
        p95Metrics,
        alertCount: periodAlerts.length,
        criticalAlertCount: periodAlerts.filter(a => a.severity === 'critical').length
      },
      trends,
      recommendations
    };
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log(`✅ Alert acknowledged: ${alertId}`);
      return true;
    }
    return false;
  }

  /**
   * Set up Core Web Vitals monitoring using PerformanceObserver
   */
  private setupCoreWebVitalsMonitoring(): void {
    if (!this.hasPerformanceObserver) {
      console.warn('PerformanceObserver not available - Core Web Vitals monitoring disabled');
      return;
    }

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntryList;
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntryList;
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('fcp', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries() as PerformanceEntryList;
        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntryList;
        for (const entry of entries) {
          this.recordMetric('fid', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      console.log('✅ Core Web Vitals monitoring enabled');

    } catch (error) {
      console.error('❌ Failed to setup Core Web Vitals monitoring:', error);
    }
  }

  /**
   * Set up resource timing monitoring
   */
  private setupResourceTimingMonitoring(): void {
    if (!this.hasResourceTiming) {
      console.warn('Resource Timing API not available');
      return;
    }

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[];

        for (const entry of entries) {
          // Track slow resources
          const duration = entry.responseEnd - entry.startTime;
          if (duration > 1000) { // Resources taking more than 1 second
            this.createAlert({
              metric: 'dataFetchTime',
              value: duration,
              threshold: 1000,
              severity: 'medium',
              description: `Slow resource: ${entry.name} (${duration.toFixed(0)}ms)`
            });
          }

          // Track failed resources
          if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
            this.createAlert({
              metric: 'errorRate',
              value: 1,
              threshold: 0,
              severity: 'high',
              description: `Failed resource: ${entry.name}`
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      console.log('✅ Resource timing monitoring enabled');

    } catch (error) {
      console.error('❌ Failed to setup resource timing monitoring:', error);
    }
  }

  /**
   * Set up navigation timing monitoring
   */
  private setupNavigationTimingMonitoring(): void {
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[];

        for (const entry of entries) {
          // Record navigation metrics
          this.recordMetric('ttfb', entry.responseStart - entry.requestStart);

          const pageLoadTime = entry.loadEventEnd - entry.navigationStart;
          this.recordMetric('routeLoadTime', pageLoadTime);

          // Check for slow page loads
          if (pageLoadTime > 3000) {
            this.createAlert({
              metric: 'routeLoadTime',
              value: pageLoadTime,
              threshold: 3000,
              severity: 'medium',
              description: `Slow page load: ${pageLoadTime.toFixed(0)}ms`
            });
          }
        }
      });

      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);

      console.log('✅ Navigation timing monitoring enabled');

    } catch (error) {
      console.error('❌ Failed to setup navigation timing monitoring:', error);
    }
  }

  /**
   * Set up memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if (!this.hasMemoryAPI) {
      console.warn('Memory API not available');
      return;
    }

    // Monitor memory every 5 seconds
    const memoryInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(memoryInterval);
        return;
      }

      const memoryUsage = this.getMemoryUsage();

      // Alert on high memory usage
      if (memoryUsage > 80) {
        this.createAlert({
          metric: 'memoryUsage',
          value: memoryUsage,
          threshold: 80,
          severity: 'high',
          description: `High memory usage: ${memoryUsage.toFixed(1)}%`
        });
      }
    }, 5000);

    console.log('✅ Memory monitoring enabled');
  }

  /**
   * Set up periodic metric collection
   */
  private setupPeriodicCollection(): void {
    const collectionInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(collectionInterval);
        return;
      }

      // Collect current metrics
      const currentMetrics = this.getCurrentMetrics();

      // Store metrics if enabled
      if (this.config.persistMetrics) {
        this.metrics.push(currentMetrics);

        // Cleanup old metrics
        if (this.metrics.length > this.config.maxStoredMetrics) {
          this.metrics = this.metrics.slice(-this.config.maxStoredMetrics);
        }
      }

      // Check alert conditions
      this.checkAlertConditions(currentMetrics);

    }, 10000); // Collect every 10 seconds

    console.log('✅ Periodic metric collection enabled');
  }

  /**
   * Set up automatic reporting
   */
  private setupAutomaticReporting(): void {
    const reportingInterval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(reportingInterval);
        return;
      }

      const now = Date.now();
      if (now - this.lastReportTime >= this.config.reportingInterval) {
        this.generateAndSendReport();
        this.lastReportTime = now;
      }

    }, this.config.reportingInterval);

    console.log('✅ Automatic reporting enabled');
  }

  /**
   * Generate and send periodic report
   */
  private generateAndSendReport(): void {
    const report = this.generateReport(1); // Last hour

    console.log('📊 Performance Report Generated:');
    console.log(`   Sessions: ${report.summary.totalSessions}`);
    console.log(`   Avg LCP: ${report.summary.averageMetrics.lcp?.toFixed(0)}ms`);
    console.log(`   Avg FID: ${report.summary.averageMetrics.fid?.toFixed(0)}ms`);
    console.log(`   Avg CLS: ${report.summary.averageMetrics.cls?.toFixed(3)}`);
    console.log(`   Alerts: ${report.summary.alertCount} (${report.summary.criticalAlertCount} critical)`);

    // In production: send to monitoring service
    this.sendReportToMonitoringService(report);
  }

  /**
   * Record a metric value
   */
  private recordMetric(metric: keyof PerformanceMetrics, value: number): void {
    // Store in recent metrics cache for quick access
    const key = `recent_${metric}`;
    (this as any)[key] = value;
  }

  /**
   * Get latest metric value
   */
  private getLatestMetric(metric: keyof PerformanceMetrics): number | null {
    const key = `recent_${metric}`;
    return (this as any)[key] || null;
  }

  /**
   * Get navigation timing metric
   */
  private getNavigationTiming(metric: string): number | null {
    if (!performance.timing) return null;

    const timing = performance.timing as any;
    if (metric in timing) {
      return timing[metric] - timing.navigationStart;
    }
    return null;
  }

  /**
   * Measure route load time
   */
  private measureRouteLoadTime(): number {
    // In a real implementation, this would track route-specific loading
    return performance.now();
  }

  /**
   * Measure route validation time
   */
  private measureRouteValidationTime(): number {
    // Track time spent in route validation
    // This would be integrated with the routing system
    return Math.random() * 5; // 0-5ms simulation
  }

  /**
   * Measure component render time
   */
  private measureComponentRenderTime(): number {
    // Track React component render time
    // This would integrate with React DevTools profiler API
    return Math.random() * 50; // 0-50ms simulation
  }

  /**
   * Measure data fetch time
   */
  private measureDataFetchTime(): number {
    // Track API call durations
    // This would integrate with fetch/axios interceptors
    return Math.random() * 200; // 0-200ms simulation
  }

  /**
   * Get memory usage percentage
   */
  private getMemoryUsage(): number {
    if (!this.hasMemoryAPI) {
      return 0;
    }

    try {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      return (used / total) * 100;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Estimate CPU usage
   */
  private estimateCPUUsage(): number {
    // Estimate CPU usage based on timing variations
    // This is a rough estimation method
    const start = performance.now();
    let iterations = 0;
    const targetTime = start + 1; // 1ms test

    while (performance.now() < targetTime) {
      iterations++;
    }

    // Higher iterations = more CPU available
    // Lower iterations = CPU constrained
    const baseline = 100000; // Baseline iteration count
    const usage = Math.max(0, 100 - (iterations / baseline) * 100);
    return Math.min(100, usage);
  }

  /**
   * Get network latency
   */
  private getNetworkLatency(): number {
    if (!this.hasConnectionAPI) {
      return 0;
    }

    try {
      const connection = (navigator as any).connection;
      return connection.rtt || 0; // Round-trip time
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): number {
    // Analyze resource timing to determine cache hits
    if (!this.hasResourceTiming) return 0;

    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      if (resources.length === 0) return 0;

      const cacheHits = resources.filter(resource => {
        // Resource served from cache if transfer size is 0 but decoded size > 0
        return resource.transferSize === 0 && resource.decodedBodySize > 0;
      }).length;

      return (cacheHits / resources.length) * 100;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): number {
    // Track JavaScript errors and failed requests
    // This would integrate with error tracking systems
    return Math.random() * 2; // 0-2% simulation
  }

  /**
   * Calculate bounce rate
   */
  private calculateBounceRate(): number {
    // Track user engagement and page interactions
    // This would integrate with analytics systems
    return Math.random() * 30; // 0-30% simulation
  }

  /**
   * Count user actions
   */
  private countUserActions(): number {
    // Track user interactions (clicks, scrolls, etc.)
    // This would integrate with event tracking
    return Math.floor(Math.random() * 50); // 0-50 actions simulation
  }

  /**
   * Check alert conditions against current metrics
   */
  private checkAlertConditions(metrics: PerformanceMetrics): void {
    for (const alertConfig of this.config.alertConfigurations) {
      const metricValue = metrics[alertConfig.metric];
      if (metricValue === null || metricValue === undefined) continue;

      const shouldAlert = this.evaluateAlertCondition(metricValue, alertConfig);
      if (shouldAlert && this.isAlertCooldownExpired(alertConfig)) {
        this.createAlert({
          metric: alertConfig.metric,
          value: metricValue,
          threshold: alertConfig.threshold,
          severity: alertConfig.severity,
          description: `${alertConfig.metric} ${alertConfig.operator} ${alertConfig.threshold} (current: ${metricValue})`
        });

        this.setAlertCooldown(alertConfig);
      }
    }
  }

  /**
   * Evaluate alert condition
   */
  private evaluateAlertCondition(value: number, config: AlertConfiguration): boolean {
    switch (config.operator) {
      case 'greater':
        return value > config.threshold;
      case 'less':
        return value < config.threshold;
      case 'equal':
        return Math.abs(value - config.threshold) < 0.001;
      default:
        return false;
    }
  }

  /**
   * Check if alert cooldown has expired
   */
  private isAlertCooldownExpired(config: AlertConfiguration): boolean {
    const key = `${config.metric}_${config.threshold}`;
    const lastAlert = this.alertCooldowns.get(key);

    if (!lastAlert) return true;

    return Date.now() - lastAlert > config.cooldownPeriod;
  }

  /**
   * Set alert cooldown
   */
  private setAlertCooldown(config: AlertConfiguration): void {
    const key = `${config.metric}_${config.threshold}`;
    this.alertCooldowns.set(key, Date.now());
  }

  /**
   * Create performance alert
   */
  private createAlert(alertData: {
    metric: keyof PerformanceMetrics;
    value: number;
    threshold: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      acknowledged: false,
      ...alertData
    };

    this.alerts.push(alert);

    // Log alert
    const severityIcon = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨'
    };

    console.log(`${severityIcon[alert.severity]} PERFORMANCE ALERT [${alert.severity.toUpperCase()}]`);
    console.log(`   ${alert.description}`);
    console.log(`   Alert ID: ${alert.id}`);

    // In production: send to alerting service
    this.sendAlert(alert);
  }

  /**
   * Send alert to monitoring service
   */
  private sendAlert(alert: PerformanceAlert): void {
    console.log(`📤 [MOCK] Alert sent to monitoring service:`, alert);
  }

  /**
   * Send report to monitoring service
   */
  private sendReportToMonitoringService(report: PerformanceReport): void {
    console.log(`📤 [MOCK] Report sent to monitoring service:`, {
      period: report.period,
      summary: report.summary,
      trendsCount: report.trends.length,
      recommendationsCount: report.recommendations.length
    });
  }

  /**
   * Calculate average metrics
   */
  private calculateAverageMetrics(metrics: PerformanceMetrics[]): Partial<PerformanceMetrics> {
    if (metrics.length === 0) return {};

    const sums: Partial<Record<keyof PerformanceMetrics, number>> = {};
    const counts: Partial<Record<keyof PerformanceMetrics, number>> = {};

    metrics.forEach(metric => {
      Object.entries(metric).forEach(([key, value]) => {
        if (typeof value === 'number' && value !== null) {
          const k = key as keyof PerformanceMetrics;
          sums[k] = (sums[k] || 0) + value;
          counts[k] = (counts[k] || 0) + 1;
        }
      });
    });

    const averages: Partial<PerformanceMetrics> = {};
    Object.entries(sums).forEach(([key, sum]) => {
      const k = key as keyof PerformanceMetrics;
      const count = counts[k] || 1;
      (averages as any)[k] = sum / count;
    });

    return averages;
  }

  /**
   * Calculate median metrics
   */
  private calculateMedianMetrics(metrics: PerformanceMetrics[]): Partial<PerformanceMetrics> {
    if (metrics.length === 0) return {};

    const medians: Partial<PerformanceMetrics> = {};
    const metricKeys = Object.keys(metrics[0]) as (keyof PerformanceMetrics)[];

    metricKeys.forEach(key => {
      const values = metrics
        .map(m => m[key])
        .filter(v => typeof v === 'number' && v !== null) as number[];

      if (values.length > 0) {
        values.sort((a, b) => a - b);
        const middle = Math.floor(values.length / 2);

        if (values.length % 2 === 0) {
          (medians as any)[key] = (values[middle - 1] + values[middle]) / 2;
        } else {
          (medians as any)[key] = values[middle];
        }
      }
    });

    return medians;
  }

  /**
   * Calculate 95th percentile metrics
   */
  private calculateP95Metrics(metrics: PerformanceMetrics[]): Partial<PerformanceMetrics> {
    if (metrics.length === 0) return {};

    const p95s: Partial<PerformanceMetrics> = {};
    const metricKeys = Object.keys(metrics[0]) as (keyof PerformanceMetrics)[];

    metricKeys.forEach(key => {
      const values = metrics
        .map(m => m[key])
        .filter(v => typeof v === 'number' && v !== null) as number[];

      if (values.length > 0) {
        values.sort((a, b) => a - b);
        const p95Index = Math.floor(values.length * 0.95);
        (p95s as any)[key] = values[p95Index];
      }
    });

    return p95s;
  }

  /**
   * Analyze performance trends
   */
  private analyzeTrends(metrics: PerformanceMetrics[]): PerformanceReport['trends'] {
    if (metrics.length < 2) return [];

    const trends: PerformanceReport['trends'] = [];
    const metricKeys: (keyof PerformanceMetrics)[] = ['lcp', 'fid', 'cls', 'routeLoadTime', 'memoryUsage'];

    metricKeys.forEach(key => {
      const values = metrics
        .map(m => m[key])
        .filter(v => typeof v === 'number' && v !== null) as number[];

      if (values.length >= 2) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;

        let trend: 'improving' | 'degrading' | 'stable';
        if (Math.abs(changePercentage) < 5) {
          trend = 'stable';
        } else if (changePercentage < 0) {
          trend = 'improving'; // Lower values are better for most metrics
        } else {
          trend = 'degrading';
        }

        trends.push({
          metric: key,
          trend,
          changePercentage: Math.abs(changePercentage)
        });
      }
    });

    return trends;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: Partial<PerformanceMetrics>, alerts: PerformanceAlert[]): string[] {
    const recommendations: string[] = [];

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Consider optimizing image loading and server response times to improve LCP');
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time and consider code splitting to improve FID');
    }

    // CLS recommendations
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Ensure images and ads have defined dimensions to prevent layout shifts');
    }

    // Memory usage recommendations
    if (metrics.memoryUsage && metrics.memoryUsage > 75) {
      recommendations.push('Monitor memory leaks and consider reducing JavaScript bundle size');
    }

    // Alert-based recommendations
    if (alerts.filter(a => a.severity === 'critical').length > 0) {
      recommendations.push('Address critical performance alerts immediately');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance metrics are within acceptable ranges');
    }

    return recommendations;
  }

  /**
   * Get empty report for periods with no data
   */
  private getEmptyReport(start: number, end: number): PerformanceReport {
    return {
      period: { start, end },
      summary: {
        totalSessions: 0,
        averageMetrics: {},
        medianMetrics: {},
        p95Metrics: {},
        alertCount: 0,
        criticalAlertCount: 0
      },
      trends: [],
      recommendations: ['No performance data available for this period']
    };
  }

  /**
   * Validate monitoring configuration
   */
  private validateConfiguration(): void {
    if (this.config.sampleRate < 0 || this.config.sampleRate > 1) {
      throw new Error('Sample rate must be between 0 and 1');
    }

    if (this.config.reportingInterval < 60000) {
      throw new Error('Reporting interval must be at least 60 seconds');
    }

    if (this.config.maxStoredMetrics < 100) {
      throw new Error('Max stored metrics must be at least 100');
    }

    console.log('✅ Performance monitoring configuration validated');
  }

  /**
   * Initialize browser API checks and warnings
   */
  private initializeBrowserAPIs(): void {
    console.log('🔍 Browser API Availability:');
    console.log(`   PerformanceObserver: ${this.hasPerformanceObserver ? '✅' : '❌'}`);
    console.log(`   Memory API: ${this.hasMemoryAPI ? '✅' : '❌'}`);
    console.log(`   Connection API: ${this.hasConnectionAPI ? '✅' : '❌'}`);
    console.log(`   Resource Timing: ${this.hasResourceTiming ? '✅' : '❌'}`);

    if (!this.hasPerformanceObserver) {
      console.warn('⚠️  PerformanceObserver not available - Core Web Vitals monitoring will be limited');
    }
  }
}

export default ProductionPerformanceMonitor;