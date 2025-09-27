import React from 'react';

/**
 * Route Analytics System
 * Tracks route performance, 404s, and user navigation patterns
 * for optimization and identifying high-demand missing routes
 */

interface RouteEvent {
  route: string;
  timestamp: number;
  userAgent: string;
  referrer?: string;
  sessionId?: string;
}

interface Route404Event extends RouteEvent {
  type: '404';
  attemptedType: 'animal' | 'country' | 'combined' | 'unknown';
  suggestions?: string[];
}

interface RouteSuccessEvent extends RouteEvent {
  type: 'success';
  loadTime: number;
  routeType: 'animal' | 'country' | 'combined' | 'organization' | 'static';
}

interface RoutePerformanceEvent extends RouteEvent {
  type: 'performance';
  metrics: {
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
  };
}

// Simple in-memory storage for analytics (future: replace with external service)
class RouteAnalyticsStore {
  private events: (Route404Event | RouteSuccessEvent | RoutePerformanceEvent)[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addEvent(event: Route404Event | RouteSuccessEvent | RoutePerformanceEvent) {
    this.events.push({
      ...event,
      sessionId: this.sessionId
    });

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Optional: Send to external analytics service
    this.sendToAnalyticsService(event);
  }

  private sendToAnalyticsService(event: Route404Event | RouteSuccessEvent | RoutePerformanceEvent) {
    // Future enhancement: integrate with analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Route Analytics:', event);
    }

    // Example integration points:
    // - Google Analytics 4
    // - Mixpanel
    // - Custom analytics endpoint
  }

  getEvents(type?: '404' | 'success' | 'performance') {
    if (type) {
      return this.events.filter(event => event.type === type);
    }
    return this.events;
  }

  get404Stats() {
    const events404 = this.events.filter(event => event.type === '404') as Route404Event[];

    const routeFrequency: Record<string, number> = {};
    const typeFrequency: Record<string, number> = {};

    events404.forEach(event => {
      routeFrequency[event.route] = (routeFrequency[event.route] || 0) + 1;
      typeFrequency[event.attemptedType] = (typeFrequency[event.attemptedType] || 0) + 1;
    });

    return {
      total404s: events404.length,
      mostRequested404s: Object.entries(routeFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      typeBreakdown: typeFrequency
    };
  }

  getPerformanceStats() {
    const successEvents = this.events.filter(event => event.type === 'success') as RouteSuccessEvent[];

    if (successEvents.length === 0) return null;

    const loadTimes = successEvents.map(event => event.loadTime);
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    const maxLoadTime = Math.max(...loadTimes);
    const minLoadTime = Math.min(...loadTimes);

    const routeTypeStats: Record<string, { count: number; avgLoadTime: number }> = {};
    successEvents.forEach(event => {
      if (!routeTypeStats[event.routeType]) {
        routeTypeStats[event.routeType] = { count: 0, avgLoadTime: 0 };
      }
      routeTypeStats[event.routeType].count++;
    });

    // Calculate averages for each route type
    Object.keys(routeTypeStats).forEach(type => {
      const typeEvents = successEvents.filter(event => event.routeType === type);
      const avgTime = typeEvents.reduce((sum, event) => sum + event.loadTime, 0) / typeEvents.length;
      routeTypeStats[type].avgLoadTime = avgTime;
    });

    return {
      totalRoutes: successEvents.length,
      averageLoadTime,
      maxLoadTime,
      minLoadTime,
      routeTypeStats
    };
  }
}

// Global analytics store instance
const analyticsStore = new RouteAnalyticsStore();

/**
 * Hook for route analytics tracking
 */
export const useRouteAnalytics = () => {
  const track404 = (
    attemptedRoute: string,
    attemptedType: 'animal' | 'country' | 'combined' | 'unknown',
    suggestions?: string[],
    referrer?: string
  ) => {
    analyticsStore.addEvent({
      type: '404',
      route: attemptedRoute,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: referrer || document.referrer,
      attemptedType,
      suggestions
    });
  };

  const trackRouteSuccess = (
    route: string,
    routeType: 'animal' | 'country' | 'combined' | 'organization' | 'static',
    loadTime: number
  ) => {
    analyticsStore.addEvent({
      type: 'success',
      route,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      routeType,
      loadTime
    });
  };

  const trackPerformance = (
    route: string,
    metrics: {
      lcp?: number;
      fid?: number;
      cls?: number;
      ttfb?: number;
    }
  ) => {
    analyticsStore.addEvent({
      type: 'performance',
      route,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      metrics
    });
  };

  const trackRouteView = (routeId: string, pathname: string, params?: Record<string, string>) => {
    analyticsStore.addEvent({
      type: 'success',
      route: routeId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      routeType: 'static', // Will be enhanced based on route analysis
      loadTime: 0 // Initial view, no load time yet
    });
  };

  const trackRouteValidation = (routeId: string, isValid: boolean, validationTime: number) => {
    // Track validation performance
    analyticsStore.addEvent({
      type: 'performance',
      route: routeId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      metrics: {
        ttfb: validationTime // Using TTFB for validation time
      }
    });

    // Track validation failures as 404-like events
    if (!isValid) {
      analyticsStore.addEvent({
        type: '404',
        route: routeId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        attemptedType: 'unknown',
        suggestions: []
      });
    }
  };

  return {
    track404,
    trackRouteSuccess,
    trackPerformance,
    trackRouteView,
    trackRouteValidation,
    getStats: () => ({
      404: analyticsStore.get404Stats(),
      performance: analyticsStore.getPerformanceStats(),
      events: analyticsStore.getEvents()
    })
  };
};

/**
 * Route performance monitoring utility
 */
export const withRoutePerformanceTracking = (
  routeComponent: React.ComponentType,
  routeType: 'animal' | 'country' | 'combined' | 'organization' | 'static'
) => {
  return (props: Record<string, unknown>) => {
    const { trackRouteSuccess, trackPerformance } = useRouteAnalytics();
    const [startTime] = React.useState(Date.now());

    React.useEffect(() => {
      const loadTime = Date.now() - startTime;
      const route = window.location.pathname;

      trackRouteSuccess(route, routeType, loadTime);

      // Track Core Web Vitals if available
      if ('web-vitals' in window) {
        // Future enhancement: integrate with web-vitals library
      }

      // Basic performance tracking
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            trackPerformance(route, { lcp: entry.startTime });
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => observer.disconnect();
    }, [trackRouteSuccess, trackPerformance, startTime]);

    return React.createElement(routeComponent, props);
  };
};

export default analyticsStore;